"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth, type SessionUser } from "./AuthProvider";

function DieMark() {
  return (
    <div className="auth-die" aria-hidden="true">
      <span className="auth-die-pip" />
    </div>
  );
}

export default function AuthFlow() {
  const { showFlow, flowMode, closeFlow, login, user } = useAuth();
  const [step, setStep] = useState<1 | 2 | "signin">(1);
  const [name, setName] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [splash, setSplash] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showFlow) return;
    setError("");
    setBusy(false);
    if (flowMode === "signin") setStep("signin");
    else {
      setStep(1);
      setName("");
      setPreview(null);
    }
  }, [showFlow, flowMode]);

  function finish(next: SessionUser) {
    setWelcomeName(next.name);
    setSplash(true);
    setTimeout(() => {
      login(next);
      setSplash(false);
    }, 2200);
  }

  async function continueName(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const clean = name.trim();
    if (clean.length < 2) return setError("Pick a name with at least 2 characters.");
    if (clean.length > 20) return setError("Keep it to 20 characters.");
    setBusy(true);
    const check = await fetch("/api/auth", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: clean }),
    });
    const data = await check.json();
    setBusy(false);
    if (data.ok) {
      setError("That name is already taken. Sign in, or pick another.");
      return;
    }
    setStep(2);
  }

  async function completeSignup(avatar: string | null) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), avatar }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) {
      setError(data.error || "Could not create account.");
      setStep(1);
      return;
    }
    finish(data.user);
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) {
      setError(data.error || "No account with that name.");
      return;
    }
    finish(data.user);
  }

  function onFile(file?: File) {
    if (!file) return;
    if (file.size > 280_000) {
      setError("Please use an image under 280KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  if (!showFlow && !splash) return null;

  if (splash) {
    return (
      <div className="auth-stage welcome-stage">
        <div className="starfield" />
        <div className="auth-rays" />
        <div className="welcome-core">
          <DieMark />
          <h1 className="welcome-title">Welcome, {welcomeName || user?.name}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-stage">
      <div className="starfield" />
      <div className="auth-rays" />
      <div className="rd-modal auth-card">
        <DieMark />
        {step === 1 && (
          <form className="rd-login-form" onSubmit={continueName}>
            <div className="auth-step">Step 1 of 2</div>
            <h2 className="rd-modal-title">Choose your name</h2>
            <p className="rd-modal-sub">This is how you&apos;ll appear on the leaderboards and in chat. Every name can only be used once.</p>
            <input
              className="rd-input"
              value={name}
              maxLength={20}
              placeholder="RoyalPlayer"
              autoFocus
              onChange={(e) => setName(e.target.value.replace(/[^\w]/g, ""))}
            />
            <div className="auth-count">{name.length}/20</div>
            {error && <p className="rd-modal-error">{error}</p>}
            <button className="rd-modal-save" disabled={busy}>
              Continue
            </button>
            <button
              type="button"
              className="auth-alt"
              onClick={() => {
                setError("");
                setStep("signin");
              }}
            >
              Already have an account? Sign in
            </button>
            <button type="button" className="auth-skip" onClick={closeFlow}>
              {user ? `Keep playing as ${user.name}` : "Play as guest"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="rd-avatar-pick">
            <div className="auth-step">Step 2 of 2</div>
            <h2 className="rd-modal-title">Add a profile picture</h2>
            <p className="rd-modal-sub">Optional — skip it and we&apos;ll give you the Royal Dice avatar.</p>
            <button type="button" className="rd-avatar-btn" onClick={() => fileRef.current?.click()} aria-label="Choose picture">
              {preview ? <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="rd-avatar-plus">+</span>}
            </button>
            <input
              ref={fileRef}
              className="rd-avatar-file"
              type="file"
              accept="image/*"
              tabIndex={-1}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {error && <p className="rd-modal-error">{error}</p>}
            <button
              type="button"
              className="rd-modal-save"
              disabled={busy}
              onClick={() => (preview ? completeSignup(preview) : fileRef.current?.click())}
            >
              {preview ? "Continue" : "Upload a picture"}
            </button>
            <button
              type="button"
              className="auth-ghost"
              disabled={busy}
              onClick={() => completeSignup(preview)}
            >
              Skip for now
            </button>
          </div>
        )}

        {step === "signin" && (
          <form className="rd-login-form" onSubmit={signIn}>
            <div className="auth-step">Welcome back</div>
            <h2 className="rd-modal-title">Sign in</h2>
            <p className="rd-modal-sub">Enter the name you registered with.</p>
            <input className="rd-input" value={name} maxLength={20} placeholder="Your name" autoFocus onChange={(e) => setName(e.target.value)} />
            {error && <p className="rd-modal-error">{error}</p>}
            <button className="rd-modal-save" disabled={busy}>
              Continue
            </button>
            <button type="button" className="auth-alt" onClick={() => { setError(""); setStep(1); }}>
              New here? Create a name
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
