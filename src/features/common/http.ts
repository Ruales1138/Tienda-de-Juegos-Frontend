import { API_BASE_URL } from "./config";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = "No fue posible completar la solicitud.";
    try {
      const body = (await response.json()) as { error?: string };
      message = body.error ?? message;
    } catch {
      // The API may return an empty response for some errors.
    }
    throw new HttpError(response.status, message);
  }

  return response.json() as Promise<T>;
}
