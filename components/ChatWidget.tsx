"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { id: string; name: string; text: string; at: number; color?: string };

const EMOJIS = ["😀", "😂", "😍", "🔥", "👍", "🎲", "💜", "😭", "😎", "🙏"];
const NAME_KEY = "royal-dice-chat-name";
const COLOR_KEY = "royal-dice-chat-color";

function randomName() {
  return `player${Math.floor(1000 + Math.random() * 9000)}`;
}

function randomColor() {
  const hues = [268, 210, 340, 150, 30, 190];
  const h = hues[Math.floor(Math.random() * hues.length)];
  return `hsl(${h} 70% 46%)`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [name, setName] = useState("Guest");
  const [color, setColor] = useState("#7c3aed");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(NAME_KEY);
    const storedColor = localStorage.getItem(COLOR_KEY);
    if (stored) setName(stored);
    else {
      const n = randomName();
      setName(n);
      localStorage.setItem(NAME_KEY, n);
    }
    if (storedColor) setColor(storedColor);
    else {
      const c = randomColor();
      setColor(c);
      localStorage.setItem(COLOR_KEY, c);
    }
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
    const t = setInterval(load, 2000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [open]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const grouped = messages;

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const next = text.trim();
    if (!next) return;
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(COLOR_KEY, color);
    setText("");
    setEmojiOpen(false);
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text: next, color }),
    });
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
          <div className="chat-head">
            <div className="chat-head-left">
              <strong>Community Chat</strong>
              <span className="chat-sub">Resets daily</span>
            </div>
            <button type="button" className="chat-gear" aria-label="Chat settings" onClick={() => setSettings((v) => !v)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M19.4 13a7.8 7.8 0 0 0 .1-2l2-1.5-2-3.5-2.4.5a8 8 0 0 0-1.7-1L15 3h-6l-.4 2.5a8 8 0 0 0-1.7 1L6.5 6 4.5 9.5 6.5 11a7.8 7.8 0 0 0 0 2l-2 1.5 2 3.5 2.4-.5a8 8 0 0 0 1.7 1L9 21h6l.4-2.5a8 8 0 0 0 1.7-1l2.4.5 2-3.5-2-1.5Z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>

          {settings && (
            <div className="chat-settings">
              <div>
                <div className="chat-settings-name">Display name</div>
                <input
                  value={name}
                  maxLength={24}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => localStorage.setItem(NAME_KEY, name.trim() || "Guest")}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid hsla(0,0%,100%,.15)",
                    background: "hsla(0,0%,100%,.06)",
                    color: "#f4eefe",
                    width: 180,
                  }}
                />
              </div>
            </div>
          )}

          <div className="chat-messages" ref={logRef}>
            {grouped.length === 0 && <p className="chat-empty">Be the first to say something.</p>}
            {grouped.map((m) => (
                <div key={m.id} className="chat-msg">
                  <span className="chat-avatar-wrap">
                    <span className="chat-avatar-default" style={m.color ? { background: m.color } : undefined} title={m.name} />
                    <span className="presence-dot is-offline" />
                  </span>
                  <div className="chat-msg-body">
                    <div className="chat-author">{m.name}</div>
                    <div className="chat-bubble-row">
                      <div className="chat-bubble">
                        <span className="chat-text">{m.text}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <form className="chat-input" onSubmit={send}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Message as ${name || "Guest"}`}
              maxLength={240}
              aria-label="Chat message"
            />
            <div className="emoji-picker chat-emoji-picker">
              <button type="button" className="emoji-picker-btn" aria-label="Emoji" onClick={() => setEmojiOpen((v) => !v)}>
                😊
              </button>
              {emojiOpen && (
                <div className="emoji-picker-grid">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className="emoji-picker-option"
                      onClick={() => {
                        setText((t) => t + e);
                        setEmojiOpen(false);
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
