"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { HttpError } from "../../common/http";
import { login as loginRequest, register as registerRequest } from "../services/auth-service";
import type { User } from "../domain/auth";

const TOKEN_KEY = "pixel-forge-token";
const USER_KEY = "pixel-forge-user";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const value = useMemo<AuthContextValue>(
    () => {
      const login = async (email: string, password: string) => {
        const result = await loginRequest(email, password);
        window.localStorage.setItem(TOKEN_KEY, result.token);
        window.localStorage.setItem(USER_KEY, JSON.stringify(result.user));
        setUser(result.user);
      };
      return {
        user,
        ready: true,
        login,
        async register(name, email, password) {
        await registerRequest({ name, email, password });
        await login(email, password);
        },
        logout() {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
        setUser(null);
        },
      };
    },
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
}

export function getStoredToken() {
  return typeof window === "undefined"
    ? null
    : window.localStorage.getItem(TOKEN_KEY);
}

export function isAuthError(error: unknown): boolean {
  return error instanceof HttpError && (error.status === 401 || error.status === 403);
}
