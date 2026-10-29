"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "login") {
        await login(String(form.get("email")), String(form.get("password")));
      } else {
        await register(
          String(form.get("name")),
          String(form.get("email")),
          String(form.get("password")),
        );
      }
      router.push("/");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "No se pudo completar la operación.";
      setError(message);
      setFieldErrors({
        email: message.toLowerCase().includes("correo") ? message : "",
        password: message.toLowerCase().includes("contraseña") ? message : "",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      {mode === "register" ? (
        <label className="grid gap-2 text-sm font-bold text-slate-200">
          Nombre completo
          <input name="name" required minLength={2} aria-invalid={Boolean(fieldErrors.name)} aria-describedby="name-error" className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-normal text-white outline-none focus:border-teal-300" />
          {fieldErrors.name ? <small id="name-error" className="text-red-300">{fieldErrors.name}</small> : null}
        </label>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-slate-200">
        Correo electrónico
        <input name="email" type="email" required aria-invalid={Boolean(fieldErrors.email)} aria-describedby="email-error" className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-normal text-white outline-none focus:border-teal-300" />
        {fieldErrors.email ? <small id="email-error" className="text-red-300">{fieldErrors.email}</small> : null}
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-200">
        Contraseña
        <input name="password" type="password" required minLength={8} aria-invalid={Boolean(fieldErrors.password)} aria-describedby="password-error" className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-normal text-white outline-none focus:border-teal-300" />
        {fieldErrors.password ? <small id="password-error" className="text-red-300">{fieldErrors.password}</small> : null}
      </label>
      {error ? <p role="alert" className="text-sm font-bold text-red-300">{error}</p> : null}
      <button disabled={pending} className="rounded-full bg-teal-300 px-6 py-3 font-extrabold text-slate-950 disabled:opacity-50">
        {pending ? "Procesando..." : mode === "login" ? "Ingresar" : "Crear cuenta"}
      </button>
    </form>
  );
}
