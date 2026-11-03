import { http } from "../../common/http";
import type { AuthResponse, RegisterRequest, User, UserRole } from "../domain/auth";

export function login(email: string, password: string, role: UserRole) {
  return http<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
}

export function register(input: RegisterRequest) {
  return http<{ user: User }>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function getCurrentUser() {
  return http<{ user: User }>("/auth/me");
}

export function updateProfile(input: { name: string }) {
  return http<{ user: User }>("/auth/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
