import { apiRequest } from "@/services/apiClient";

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  email?: string | null;
  role: "player" | "admin";
  user_type: "client" | "admin";
  skill_level?: "beginner" | "intermediate" | "pro";
  admin_role?: "super_admin" | "turf_owner" | "manager";
  is_active?: boolean;
}

interface VerifyOtpResponse {
  message: string;
  user: AuthUser;
  token: string;
}

interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

const AUTH_STORAGE_KEY = "matchhub_auth_session";
const CLIENT_ID_STORAGE_KEY = "matchhub_client_id";
const LEGACY_USER_ID_STORAGE_KEY = "matchhub_user_id";

export const signup = async (payload: {
  role: "player" | "turf_owner" | "admin";
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthSession> => {
  const data = await apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: payload.role,
      full_name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    }),
  });

  const session: AuthSession = {
    user: data.user,
    token: data.token,
  };
  saveAuthSession(session);
  return session;
};

export const login = async (payload: {
  role: "player" | "turf_owner" | "admin";
  email?: string;
  phone?: string;
  password: string;
}): Promise<AuthSession> => {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: payload.role,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    }),
  });

  const session: AuthSession = {
    user: data.user,
    token: data.token,
  };
  saveAuthSession(session);
  return session;
};

export const requestOtp = async (
  payload:
    | string
    | {
        phone: string;
        password?: string;
        mode?: "signin" | "signup";
      }
) => {
  const requestBody =
    typeof payload === "string"
      ? { phone: payload }
      : {
          phone: payload.phone,
          password: payload.password,
          mode: payload.mode,
        };

  return apiRequest<{ message: string; phone: string; otp_hint?: string }>("/auth/request-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
};

export const verifyOtp = async (payload: {
  phone: string;
  otp: string;
  full_name?: string;
  email?: string;
  password?: string;
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
  window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, session.user.id);
  window.localStorage.setItem(LEGACY_USER_ID_STORAGE_KEY, session.user.id);
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
  window.localStorage.removeItem(CLIENT_ID_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_USER_ID_STORAGE_KEY);
};
