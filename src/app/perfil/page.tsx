"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getStoredAvatar,
  storeAvatar,
  subscribeToAvatar,
} from "@/features/auth/profile-avatar";

function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const avatar = useSyncExternalStore(subscribeToAvatar, getStoredAvatar, () => null);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  function chooseAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setStatus("Selecciona una imagen válida de máximo 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        storeAvatar(result);
        setStatus("Imagen de perfil actualizada.");
      }
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    try {
      await updateProfile(name);
      setStatus("Perfil actualizado correctamente.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo actualizar el perfil.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080d16] px-6 py-12 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-bold text-teal-300 hover:text-teal-200">← Volver a Pixel Forge</Link>
        <div className="mt-8 grid overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900 shadow-2xl md:grid-cols-[260px_1fr]">
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#152e63] to-[#0f1725] p-8 text-center">
            <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-teal-300 shadow-xl">
              <Image src={avatar ?? "/profile-avatar.svg"} alt="Imagen de perfil" width={144} height={144} className="h-full w-full object-cover" />
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-5 rounded-full border border-teal-300 px-4 py-2 text-sm font-bold text-teal-300 hover:bg-teal-300 hover:text-slate-950">Cambiar imagen</button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={chooseAvatar} className="hidden" />
            <p className="mt-4 text-xs text-slate-400">JPG, PNG o GIF · máximo 2 MB</p>
          </div>
          <div className="p-8 md:p-10">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-teal-300">Cuenta Pixel Forge</p>
            <h1 className="mt-3 text-4xl font-black">Mi perfil</h1>
            <p className="mt-2 text-slate-300">Personaliza tu cuenta y mantén tus datos actualizados.</p>
            <form onSubmit={saveProfile} className="mt-8 grid gap-5">
              <label className="grid gap-2 font-bold">
                Nombre
                <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-normal outline-none focus:border-teal-300" />
              </label>
              <div className="grid gap-2">
                <span className="font-bold">Correo electrónico</span>
                <p className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-400">{user.email}</p>
                <span className="text-xs text-slate-500">El correo no se puede modificar.</span>
              </div>
              <p className="text-sm text-slate-400">Rol: <span className="font-bold text-slate-200">{user.role}</span></p>
              <button disabled={pending} className="rounded-full bg-teal-300 px-6 py-3 font-extrabold text-slate-950 disabled:opacity-50">
                {pending ? "Guardando..." : "Guardar nombre"}
              </button>
              {status ? <p role="status" className="text-sm font-bold text-teal-300">{status}</p> : null}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return <AuthGuard><ProfileContent /></AuthGuard>;
}
