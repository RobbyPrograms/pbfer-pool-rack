"use client";
import { FormEvent, useRef, useState } from "react";
import styles from "./SupportSection.module.css";
const topics = [
  { title: "Orders & Shipping", description: "Questions about your order, shipping, or delivery.", icon: "orders" },
  { title: "Product Support", description: "Assembly, usage, maintenance, or product concerns.", icon: "product" },
  { title: "Returns & Replacements", description: "Need help with a return or replacement? Start here.", icon: "returns" },
  { title: "General Questions", description: "Questions about Built True or something not listed here.", icon: "questions" },
];
const questions = [
  { question: "How do I use TrueRack?", answer: "Open the folding arms fully to the integrated stop, then position TrueRack around your billiard balls. Bring the balls together into a tight rack, then lift TrueRack clear before breaking. If you need help with your setup, choose Product Support above." },
  { question: "Can I track my order?", answer: "Have a tracking link? Open it to check the carrier?s latest delivery updates. If you need help finding tracking information or checking your order, select Orders & Shipping and include your order number in your message." },
  { question: "What if there?s a problem with my TrueRack?", answer: "Choose Product Support or Returns & Replacements and describe what happened. Include your order number, if available, so we can help you with the next steps." },
];
export function SupportSection() {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("");
  const contact = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  function selectTopic(title: string) {
    setTopic(title);
    contact.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    nameInput.current?.focus({ preventScroll: true });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) { setStatus("Online messaging is not available yet. Please check back soon."); return; }
    const data = new FormData(event.currentTarget);
    const body = "Name: " + data.get("name") + "\nEmail: " + data.get("email") + "\nTopic: " + topic + "\n\n" + data.get("message");
    window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("TrueRack support: " + topic) + "&body=" + encodeURIComponent(body);
    setStatus("Your email app will open with your message. Send it there to contact Built True.");
  }
  return (
    <section id="support" className={styles.section} aria-labelledby="support-title">
      <div className={styles.content}>
        <header className={styles.heading}>
          <h2 id="support-title" className="display">We&apos;re Here to Help.</h2>
          <p>Questions about True<span>Rack</span>, your order, or anything else?<br />We&apos;re here to make things right.</p>
        </header>
        <div className={styles.topics}>
          {topics.map((item) => <button key={item.title} type="button" className={styles.card} onClick={() => selectTopic(item.title)}>
            <span aria-hidden="true" className={styles.icon} style={{ maskImage: "url(/support/" + item.icon + ".svg)", WebkitMaskImage: "url(/support/" + item.icon + ".svg)" }} />
            <span><span className={styles.cardTitle}>{item.title}</span><span className={styles.cardDescription}>{item.description}</span></span>
          </button>)}
        </div>
        <div id="support-contact" ref={contact} className={styles.contact}>
          <div><p className={styles.eyebrow}>Contact Us</p><h3 className="display">Get in Touch.</h3><p className={styles.intro}>Send us a message and we&apos;ll get back to you as soon as we can.</p></div>
          <form className={styles.form} onSubmit={submit}>
            <div className={styles.fields}>
              <label>Name<input ref={nameInput} name="name" autoComplete="name" placeholder="Your name" maxLength={100} required /></label>
              <label>Email<input name="email" type="email" autoComplete="email" placeholder="Your email" maxLength={254} required /></label>
            </div>
            <label>What can we help with?<select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)} required><option value="" disabled>Select a topic</option>{topics.map((item) => <option key={item.title}>{item.title}</option>)}</select></label>
            <label>Message<textarea name="message" placeholder="Tell us how we can help?" rows={5} maxLength={5000} required /></label>
            <button type="submit" className={styles.send}>Send Message</button>
            <p className={styles.status} role="status">{status || (email ? "Opens your email app so you can review and send your message." : "Online messaging is being set up.")}</p>
          </form>
        </div>
        <div className={styles.faq}>
          <p className={styles.eyebrow}>Common Questions</p><h3 className="display">Frequently Asked Questions.</h3>
          <div className={styles.answers}>{questions.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
        </div>
      </div>
    </section>
  );
}
