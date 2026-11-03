"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { HttpError } from "../../common/http";
import {
  login as loginRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
} from "../services/auth-service";
import type { User, UserRole } from "../domain/auth";

const TOKEN_KEY = "pixel-forge-token";
const USER_KEY = "pixel-forge-user";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUserValue(): string | null {
  if (typeof window === "undefined") return null;
  if (!window.localStorage.getItem(TOKEN_KEY)) return null;
  return window.localStorage.getItem(USER_KEY);
}

function parseUser(stored: string | null): User | null {
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

function subscribeToAuth(callback: () => void) {
  window.addEventListener("pixel-forge-auth-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("pixel-forge-auth-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function subscribeToHydration() {
  return () => {};
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const ready = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const storedUser = useSyncExternalStore(
    subscribeToAuth,
    readStoredUserValue,
    () => null,
  );
  const user = parseUser(storedUser);

  const value = useMemo<AuthContextValue>(
    () => {
      const login = async (email: string, password: string, role: UserRole) => {
        const result = await loginRequest(email, password, role);
        window.localStorage.setItem(TOKEN_KEY, result.token);
        window.localStorage.setItem(USER_KEY, JSON.stringify(result.user));
        window.dispatchEvent(new Event("pixel-forge-auth-change"));
      };
      return {
        user,
        ready,
        login,
        async register(name, email, password, role) {
        await registerRequest({ name, email, password, role });
        await login(email, password, role);
        },
        async updateProfile(name) {
          const result = await updateProfileRequest({ name });
          window.localStorage.setItem(USER_KEY, JSON.stringify(result.user));
          window.dispatchEvent(new Event("pixel-forge-auth-change"));
        },
        logout() {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
        window.dispatchEvent(new Event("pixel-forge-auth-change"));
        },
      };
    },
    [ready, user],
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
