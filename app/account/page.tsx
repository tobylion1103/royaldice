"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function AccountPage() {
  const { user, ready, login, logout, openFlow } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [fileName, setFileName] = useState("No file selected");
  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [flips, setFlips] = useState(0);
  const [spins, setSpins] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || "");
    setBio(user.bio || "");
    setPreview(user.avatar);
    fetch(`/api/auth?name=${encodeURIComponent(user.name)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) return;
        setDisplayName(d.user.displayName || "");
        setBio(d.user.bio || "");
        setPreview(d.user.avatar);
        setSpins(Number(localStorage.getItem("royal-dice-spin-count") || d.user.spins || 0));
      })
      .catch(() => {});
    try {
      const hist = JSON.parse(localStorage.getItem("royal-dice-recent") || "[]");
      setRolls(Array.isArray(hist) ? hist.length : 0);
    } catch {}
    setFlips(Number(localStorage.getItem("royal-dice-flip-count") || 0));
  }, [user]);

  if (!ready) return null;

  if (!user) {
    return (
      <main className="account-page">
        <h1 className="account-title">My account</h1>
        <p className="account-sub">Sign in to edit your profile and view stats.</p>
        <button className="rd-modal-save flash-btn" type="button" onClick={() => openFlow("signin")}>
          Sign in
        </button>
      </main>
    );
  }

  function onFile(file?: File) {
    if (!file) return;
    if (file.size > 280_000) {
      setMsg("Please use an image under 280KB.");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/auth", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user!.name,
        displayName,
        bio,
        avatar: preview,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) {
      setMsg(data.error || "Could not save.");
      return;
    }
    login(data.user);
    setMsg("Profile saved.");
  }

  return (
    <main className="account-page">
      <div className="account-head">
        <div>
          <h1 className="account-title">My account</h1>
          <p className="account-sub">Logged in as {user.name}</p>
        </div>
        <button type="button" className="account-logout" onClick={logout}>
          Log out
        </button>
      </div>

      <section className="rd-card">
        <h2 className="rd-card-title">My profile</h2>
        <form className="rd-pf" onSubmit={save}>
          <div className="rd-pf-avatar-row">
            <div className="rd-pf-avatar">
              {preview ? <img src={preview} alt="" /> : <span className="chat-avatar-default" style={{ width: 66, height: 66 }} />}
            </div>
            <div>
              <div className="rd-filepick">
                <button type="button" className="rd-filepick-btn" onClick={() => fileRef.current?.click()}>
                  Choose file
                </button>
                <span className="rd-filepick-name">{fileName}</span>
              </div>
              <p className="rd-pf-hint">PNG, JPG or WEBP. Keep it under 280KB.</p>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
            </div>
          </div>

          <label className="rd-field-label">
            Display name
            <input
              className="rd-input"
              value={displayName}
              maxLength={24}
              placeholder={user.name}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <p className="rd-pf-hint">This is how you&apos;re shown. Leave empty to use your username ({user.name}).</p>

          <label className="rd-field-label">
            Bio
            <textarea
              className="rd-input rd-textarea"
              value={bio}
              maxLength={280}
              placeholder="Tell something about yourself..."
              onChange={(e) => setBio(e.target.value)}
            />
          </label>

          {msg && <div className={`rd-pf-msg ${msg.includes("saved") ? "is-ok" : ""}`}>{msg}</div>}

          <div className="rd-pf-actions">
            <button className="rd-modal-save flash-btn pulse-glow" disabled={busy}>
              Save profile
            </button>
            <Link className="rd-pf-view" href={`/u/${encodeURIComponent(user.name)}`}>
              View my profile
            </Link>
          </div>
        </form>
      </section>

      <section className="rd-card">
        <h2 className="rd-card-title">My statistics</h2>
        <div className="rd-stats">
          <div className="rd-stat">
            <span className="rd-stat-emoji">🎲</span>
            <span className="rd-stat-num">{rolls}</span>
            <span className="rd-stat-label">Rolls</span>
          </div>
          <div className="rd-stat">
            <span className="rd-stat-emoji">🪙</span>
            <span className="rd-stat-num">{flips}</span>
            <span className="rd-stat-label">Flips</span>
          </div>
          <div className="rd-stat">
            <span className="rd-stat-emoji">🟣</span>
            <span className="rd-stat-num">{spins}</span>
            <span className="rd-stat-label">Spins</span>
          </div>
        </div>
      </section>
    </main>
  );
}
