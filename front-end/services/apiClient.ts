export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

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
