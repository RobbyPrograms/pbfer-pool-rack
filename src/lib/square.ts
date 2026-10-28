const SQUARE_VERSION = "2025-10-16";

export function getSquareConfig() {
  const token = process.env.SQUARE_ACCESS_TOKEN?.trim() || "";
  const locationId = process.env.SQUARE_LOCATION_ID?.trim() || "";
  const environment =
    process.env.SQUARE_ENV === "production" ? "production" : "sandbox";
  const baseUrl =
    environment === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

  return {
    token,
    locationId,
    environment,
    baseUrl,
    ready: Boolean(token && locationId),
  };
}

export async function squareFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { token, baseUrl, ready } = getSquareConfig();
  if (!ready) {
    throw new Error("Square isn't configured.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    errors?: { detail?: string; code?: string }[];
  };

  if (!response.ok) {
    const detail = data.errors?.[0]?.detail || data.errors?.[0]?.code;
    throw new Error(detail || `Square returned ${response.status}.`);
  }

  return data;
}
