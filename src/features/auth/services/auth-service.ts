import { http } from "../../common/http";
import type { AuthResponse, RegisterRequest, User } from "../domain/auth";

export function login(email: string, password: string) {
  return http<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
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
