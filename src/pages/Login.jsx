// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const API_URL = import.meta.env.VITE_API_URL || "";
const RECAPTCHA_SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY || "").trim();
const HAS_RECAPTCHA = RECAPTCHA_SITE_KEY.length > 0;
const IS_DEV = import.meta.env.DEV;

export default function Login() {
  const [rcReady, setRcReady] = useState(!HAS_RECAPTCHA);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // Cargar reCAPTCHA sólo si hay key
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
      if (IS_DEV) console.warn("reCAPTCHA no se pudo cargar; ignorado en desarrollo.");
      setRcReady(true); // no bloqueamos el submit
    };
    document.head.appendChild(s);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOkMsg("");

    try {
      setLoading(true);

      let recaptchaToken;
      if (HAS_RECAPTCHA && window.grecaptcha?.execute) {
        await new Promise((res) => window.grecaptcha.ready(res));
        recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "request_link" });
      }

      const res = await fetch(`${API_URL}/api/auth/request-link`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || "No pudimos enviar el enlace.");

      setOkMsg("Te enviamos un enlace de verificación a tu correo 🙌");
    } catch (err) {
      setError(err.message || "Error enviando el enlace.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: 680 }}>
      <style>{`
        .login-card { border-radius: 12px; max-width: 600px; }
        .login-title { font-weight: 700; font-size: 1.5rem; text-align:center; }
        .login-sub { color:#6c757d; text-align:center; font-size: .95rem; }
        .login-btn { font-weight: 600; padding:.625rem 1rem; }
      `}</style>

      <Card className="shadow-sm login-card mx-auto">
        <Card.Body className="p-4">
          <h3 className="login-title mb-2">Verifica tu correo</h3>
          <p className="login-sub mb-4">
            Te enviaremos un enlace para continuar a tu propuesta.
          </p>

          {okMsg && <Alert variant="success" className="mb-3">{okMsg}</Alert>}
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="tucorreo@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 login-btn"
              disabled={loading || (HAS_RECAPTCHA && !rcReady)}
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
