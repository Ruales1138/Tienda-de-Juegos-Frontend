"use client";

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export function AuthGuard({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, ready } = useAuth();

  useEffect(() => {
    if (ready && (!user || (adminOnly && user.role !== "ADMIN"))) {
      window.location.replace("/login");
    }
  }, [adminOnly, ready, user]);

  if (!ready || !user || (adminOnly && user.role !== "ADMIN")) {
    return <p className="p-8 text-slate-300">Verificando sesión...</p>;
  }
  return <>{children}</>;
}
