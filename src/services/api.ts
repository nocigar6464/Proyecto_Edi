/// <reference types="vite/client" />
const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",              // <- importante para cookie
    headers: { "content-type": "application/json", ...(init.headers || {}) },
    ...init
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "request_failed");
  return data as T;
}

export const api = {
  // contacto
  contact: (body: { name: string; email: string; message: string; recaptchaToken?: string }) =>
    http<{ ok: true }>("/api/contact", { method: "POST", body: JSON.stringify(body) }),

  // cotización
  quote: (body: any) =>
    http<{ ok: true }>("/api/quote", { method: "POST", body: JSON.stringify(body) }),

  // auth
  requestLink: (email: string, recaptchaToken?: string) =>
    http<{ ok: true }>("/api/auth/request-link", { method: "POST", body: JSON.stringify({ email, recaptchaToken }) }),
  status: () => http<{ authenticated: boolean; user?: any }>("/api/auth/status"),
  logout: () => http<{ ok: true }>("/api/auth/logout", { method: "POST" })
};
