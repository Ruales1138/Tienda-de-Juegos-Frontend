"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export function AuthGuard({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && (!user || (adminOnly && user.role !== "ADMIN"))) {
      router.replace("/login");
    }
  }, [adminOnly, ready, router, user]);

  if (!ready || !user || (adminOnly && user.role !== "ADMIN")) {
    return <p className="p-8 text-slate-300">Verificando sesión...</p>;
  }
  return <>{children}</>;
}
