// 1. Import the session helper from your authService
import { getAuthSession } from "./authService";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5555/api";

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  // 2. Try to get the saved session
  const session = getAuthSession();
  
  // 3. Prepare headers (merging existing headers with our Auth header)
  const headers = new Headers(init?.headers);
  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }
  
  // Ensure we don't accidentally overwrite Content-Type if it was already set
  if (!headers.has("Content-Type") && !(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 4. Execute the fetch with the new headers
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorPayload = (payload || {}) as ApiErrorPayload;
    const message =
      errorPayload.error ||
      errorPayload.message ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload as T;
}