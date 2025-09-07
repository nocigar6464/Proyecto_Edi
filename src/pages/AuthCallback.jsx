// src/pages/AuthCallback.jsx
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AuthCallback() {
  useEffect(() => {
    // token puede venir como ?token=... o #token=...
    const qs = new URLSearchParams(window.location.search);
    let token = qs.get("token");

    if (!token && window.location.hash) {
      const hs = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      token = hs.get("token");
    }

    if (!token || token.length < 20) {
      window.location.replace("/login");
      return;
    }

    // Deja que el backend verifique y haga el redirect (ahí se aplica el Set-Cookie)
    const url = `${API_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;
    window.location.replace(url);
  }, []);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1>Validando tu sesión…</h1>
      <p>Te redirigiremos en un momento.</p>
    </div>
  );
}
