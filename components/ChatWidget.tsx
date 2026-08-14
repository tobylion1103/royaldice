"use client";

import { useEffect, useState } from "react";

type Msg = { id: string; name: string; text: string; at: number };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Guest");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("royal-dice-chat-name");
    if (stored) setName(stored);
  }, []);

  useEffect(() => {
    if (!open) return;
    let stop = false;
    async function load() {
      const r = await fetch("/api/chat");
      const d = await r.json();
      if (!stop) setMessages(d.messages || []);
    }
    load();
    const t = setInterval(load, 2500);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    localStorage.setItem("royal-dice-chat-name", name);
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text }),
    });
    setText("");
    const r = await fetch("/api/chat");
    const d = await r.json();
    setMessages(d.messages || []);
  }

  return (
    <>
      <button className="chat-fab" aria-label="Open community chat" onClick={() => setOpen((v) => !v)}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="chat-panel">
          <header>
            Community chat
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}>
              ×
            </button>
          </header>
          <div className="chat-log">
            {messages.length === 0 && <p className="muted">No messages yet.</p>}
            {messages.map((m) => (
              <div key={m.id} className="chat-line">
                <b>{m.name}</b> {m.text}
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={send}>
            <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" style={{ maxWidth: 88 }} />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
