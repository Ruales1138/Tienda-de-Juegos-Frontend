"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const { user } = useAuth();
  useEffect(() => {
    if (user) window.location.replace("/");
  }, [user]);
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d16] px-6 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8">
        <Link href="/" className="text-xl font-black text-amber-300">Pixel Forge</Link>
        <h1 className="mt-8 text-3xl font-black">Ingresar</h1>
        <p className="mt-2 mb-8 text-slate-300">Accede para enviar y consultar tus solicitudes.</p>
        <AuthForm mode="login" />
        <p className="mt-6 text-sm text-slate-400">¿No tienes cuenta? <Link href="/registro" className="font-bold text-teal-300">Regístrate</Link></p>
      </section>
    </main>
  );
}
