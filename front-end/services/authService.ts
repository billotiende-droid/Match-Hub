import { apiRequest } from "@/services/apiClient";

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  email?: string | null;
  role: "player" | "owner" | "admin";
}

interface VerifyOtpResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

const AUTH_STORAGE_KEY = "matchhub_auth_session";

export const requestOtp = async (phone: string) => {
  return apiRequest<{ message: string; phone: string }>("/auth/request-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
};

export const verifyOtp = async (payload: {
  phone: string;
  otp: string;
  name?: string;
}): Promise<AuthSession> => {
  const data = await apiRequest<VerifyOtpResponse>("/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const session: AuthSession = {
    user: data.user,
    token: data.token,
  };

  saveAuthSession(session);
  return session;
};

export const saveAuthSession = (session: AuthSession) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.localStorage.setItem("matchhub_user_id", session.user.id);
};

export const getAuthSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.user?.id) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem("matchhub_user_id");
};
