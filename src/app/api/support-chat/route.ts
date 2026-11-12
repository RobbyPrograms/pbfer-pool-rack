import { NextResponse } from "next/server";
import { SUPPORT_CONFIG, approvedSupportAnswers, type SupportMessage } from "@/lib/support-config";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
function fail(message: string, status: number) {
  return NextResponse.json({ error: message, contactPayton: true }, { status, headers });
}

export async function GET() {
  return NextResponse.json({ available: Boolean(process.env.OPENAI_API_KEY?.trim()) }, { headers });
}

export async function POST(request: Request) {
  const limits = SUPPORT_CONFIG.limits;
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return fail("Please use the support chat on this website.", 403);
  if (!rateLimit(`support-chat:${clientKey(request)}`, limits.perMinute, 60_000)) {
    return fail("You've sent several questions. Please wait a minute, or contact Payton.", 429);
  }
  let body: { category?: unknown; messages?: unknown };
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) return fail("Invalid chat request.", 400);
    if (Number(request.headers.get("content-length")) > limits.bodyBytes) return fail("Your conversation is too long. Contact Payton for help.", 413);
    // Bound the stream too; Content-Length is not trustworthy or always present.
    const reader = request.body?.getReader();
    if (!reader) return fail("Enter a question first.", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limits.bodyBytes) { await reader.cancel(); return fail("Your conversation is too long. Contact Payton for help.", 413); }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail("Invalid chat request.", 400);
  } catch { return fail("Invalid chat request.", 400); }
  const category = SUPPORT_CONFIG.categories.find((item) => item.id === body.category);
  if (!category || !Array.isArray(body.messages) || !body.messages.length || body.messages.length > limits.messages) return fail("Invalid category or conversation length.", 400);
  const messages: SupportMessage[] = [];
  for (const [index, message] of body.messages.entries()) {
    if (!message || typeof message !== "object" || message.role !== (index % 2 === 0 ? "user" : "assistant") || typeof message.content !== "string" || !message.content.trim() || message.content.length > (message.role === "user" ? limits.messageChars : 3000)) return fail("Invalid message. Keep questions under 1,000 characters.", 400);
    messages.push({ role: message.role, content: message.content.trim() });
  }
  if (messages.at(-1)?.role !== "user" || messages.reduce((sum, item) => sum + item.content.length, 0) > limits.totalChars) return fail("This conversation has reached its limit. Contact Payton for more help.", 400);
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return fail(SUPPORT_CONFIG.unavailable, 503);
  if (!rateLimit("support-chat:global", limits.globalPerHour, 3_600_000)) return fail(SUPPORT_CONFIG.unavailable, 429);
  const answers = approvedSupportAnswers();
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        model: process.env.OPENAI_SUPPORT_MODEL || SUPPORT_CONFIG.model,
        store: false,
        max_output_tokens: 200,
        instructions: `${SUPPORT_CONFIG.instructions}\nCategory: ${category.title}\n${category.instructions}\nApproved answers:\n${JSON.stringify(answers)}\nPolicies (null means unknown):\n${JSON.stringify(SUPPORT_CONFIG.policies)}`,
        input: messages,
        text: { format: {
          type: "json_schema", name: "approved_support_answer", strict: true,
          schema: { type: "object", properties: { answer_ids: { type: "array", items: { type: "string", enum: answers.map((item) => item.id) } }, needs_human: { type: "boolean" } }, required: ["answer_ids", "needs_human"], additionalProperties: false },
        } },
      }),
    });
    if (!response.ok) return fail(SUPPORT_CONFIG.unavailable, 503);
    const result = await response.json();
    if (result.status !== "completed") return fail(SUPPORT_CONFIG.unavailable, 503);
    const output = result.output?.flatMap((item: { content?: { type: string; text?: string }[] }) => item.content ?? []).filter((part: { type: string }) => part.type === "output_text").map((part: { text: string }) => part.text).join("");
    const selected = JSON.parse(output || "{}");
    if (!Array.isArray(selected.answer_ids) || selected.answer_ids.length > 3 || typeof selected.needs_human !== "boolean" || selected.answer_ids.some((id: unknown) => !answers.some((item) => item.id === id))) return fail(SUPPORT_CONFIG.unavailable, 503);
    const ids = new Set<string>(selected.answer_ids);
    const reply = answers.filter((item) => ids.has(item.id)).map((item) => item.text);
    const contactPayton = selected.needs_human || !reply.length;
    if (contactPayton) reply.push(SUPPORT_CONFIG.handoff);
    // Never display arbitrary model-generated factual text: only approved entries.
    return NextResponse.json({ reply: reply.join("\n\n"), contactPayton }, { headers });
  } catch { return fail(SUPPORT_CONFIG.unavailable, 503); }
}
