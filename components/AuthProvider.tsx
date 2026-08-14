"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SessionUser = {
  name: string;
  avatar: string | null;
  displayName?: string;
  bio?: string;
};

type AuthCtx = {
  user: SessionUser | null;
  ready: boolean;
  showFlow: boolean;
  openFlow: (mode?: "signup" | "signin") => void;
  closeFlow: () => void;
  flowMode: "signup" | "signin";
  login: (user: SessionUser) => void;
  logout: () => void;
};

const KEY = "royal-dice-user";
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [showFlow, setShowFlow] = useState(false);
  const [flowMode, setFlowMode] = useState<"signup" | "signin">("signup");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
      else if (!sessionStorage.getItem("royal-dice-flow-seen")) {
        setShowFlow(true);
        sessionStorage.setItem("royal-dice-flow-seen", "1");
      }
    } catch {}
    setReady(true);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      showFlow,
      flowMode,
      openFlow: (mode = "signup") => {
        setFlowMode(mode);
        setShowFlow(true);
      },
      closeFlow: () => setShowFlow(false),
      login: (next) => {
        setUser(next);
        localStorage.setItem(KEY, JSON.stringify(next));
        localStorage.setItem("royal-dice-chat-name", next.name);
        setShowFlow(false);
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem(KEY);
      },
    }),
    [user, ready, showFlow, flowMode]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth");
  return ctx;
}
