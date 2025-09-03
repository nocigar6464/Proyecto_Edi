import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || ""; // ej. http://localhost:3000
const RECAPTCHA_SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY || "").trim();
const HAS_RECAPTCHA = RECAPTCHA_SITE_KEY.length > 0;

export default function Login() {
  const [rcReady, setRcReady] = useState(!HAS_RECAPTCHA); // si no hay key, listo de inmediato
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Carga del script SOLO si hay site key
  useEffect(() => {
    if (!HAS_RECAPTCHA) return;

    if (window.grecaptcha?.execute) {
      window.grecaptcha.ready(() => setRcReady(true));
      return;
    }

    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    s.async = true;
    s.onload = () => window.grecaptcha.ready(() => setRcReady(true));
    s.onerror = () => {
      // No bloqueamos el flujo en local: dejamos rcReady en true para permitir el submit.
      setRcReady(true);
      setError("No se pudo cargar reCAPTCHA (ignorado en desarrollo).");
    };
    document.head.appendChild(s);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      let recaptchaToken = undefined;
      if (HAS_RECAPTCHA && window.grecaptcha?.execute) {
        await new Promise((res) => window.grecaptcha.ready(res));
        recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "request_link" });
      }

      const res = await fetch(`${API_URL}/api/auth/request-link`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, recaptchaToken }), // token opcional
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || "No pudimos enviar el enlace.");

      alert("Te enviamos un enlace de verificación a tu correo 🙌");
    } catch (err) {
      setError(err.message || "Error enviando el enlace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading || (HAS_RECAPTCHA && !rcReady)}>
        {loading ? "Enviando..." : "Recibir enlace"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </form>
  );
}
