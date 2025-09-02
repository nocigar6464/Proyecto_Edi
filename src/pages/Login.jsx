import { useEffect, useState } from "react";

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || "TU_SITE_KEY_PUBLICO";

export default function Login() {
  const [rcReady, setRcReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Cargar el script UNA vez y marcar ready sólo cuando realmente esté listo
  useEffect(() => {
    // Ya cargado previamente
    if (window.grecaptcha?.execute) {
      setRcReady(true);
      return;
    }

    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
      RECAPTCHA_SITE_KEY
    )}`;
    s.async = true;
    s.onload = () => {
      // Esperar a grecaptcha.ready antes de usar execute
      window.grecaptcha.ready(() => setRcReady(true));
    };
    s.onerror = () => setError("No se pudo cargar reCAPTCHA.");
    document.head.appendChild(s);

    return () => {
      // opcional: no lo quitamos para permitir reuso en otras páginas
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!rcReady || !window.grecaptcha?.execute) {
        setError(
          "reCAPTCHA aún no está listo. Intenta de nuevo en 1–2 segundos."
        );
        return;
      }

      setLoading(true);

      // Asegura que grecaptcha esté “ready” justo antes de execute
      await new Promise((res) => window.grecaptcha.ready(res));
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "request_link",
      });

      // Envía email + token al backend
      const fd = new FormData();
      fd.append("email", email);
      fd.append("recaptcha", token);

      // Si pruebas contra tu dominio en prod:
      // const res = await fetch("https://canlab.cl/auth/request_link.php", { method: "POST", body: fd, credentials: "include" });
      const res = await fetch("/auth/request_link.php", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "No pudimos enviar el enlace.");
      }

      // mostrar feedback, etc.
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
      <button type="submit" disabled={loading || !rcReady}>
        {loading ? "Enviando..." : "Recibir enlace"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </form>
  );
}
