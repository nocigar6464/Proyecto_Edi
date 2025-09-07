/// <reference types="vite/client" />


const BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

/** Build + fetch con cookies httpOnly habilitadas */
async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data: any = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  return data as T;
}

/* ===================== Tipos ===================== */

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteBody {
  name: string;
  email: string;
  currency: string; // "CLP", "USD", etc.
  items: QuoteItem[];
  notes?: string;
}

export interface ContactBody {
  name: string;
  email: string;
  phone?: string;       
  message: string;
  recaptchaToken?: string; 
}

export interface AuthUser {
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: AuthUser;
}

/* ===================== API ===================== */

export const api = {
  // contacto
  contact: (body: ContactBody) =>
    http<{ ok: true }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // cotización
  quote: (body: QuoteBody) =>
    http<{ ok: true }>("/api/quote", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // auth
  requestLink: (email: string, recaptchaToken?: string) =>
    http<{ ok: true; sentTo?: string }>("/api/auth/request-link", {
      method: "POST",
      body: JSON.stringify({ email, recaptchaToken }),
    }),

  status: () => http<AuthStatus>("/api/auth/status"),

  logout: () => http<{ ok: true }>("/api/auth/logout", { method: "POST" }),


  auth: {
    requestLink: (email: string, recaptchaToken?: string) =>
      http<{ ok: true; sentTo?: string }>("/api/auth/request-link", {
        method: "POST",
        body: JSON.stringify({ email, recaptchaToken }),
      }),
    status: () => http<AuthStatus>("/api/auth/status"),
    logout: () => http<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  },


  pricing: async <T = any>() => {
    const r = await fetch("/public_html/pricing.json");
    return (await r.json()) as T;
  },
};


export function getAuthEmailFromStatus(s: AuthStatus | null | undefined) {
  return s?.authenticated ? s.user?.email ?? "" : "";
}

/* ===== Aliases legacy para compatibilidad (si algún componente antiguo los usa) ===== */
export const getAuthStatus = api.status;
export const postQuote = (body: QuoteBody) => api.quote(body);
