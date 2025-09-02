import { useState } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default function Contacto() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    // Validaciones simples
    if (!form.name || !form.email || !form.message /* || !form.phone */) {
      setStatus({
        type: "danger",
        msg: "Por favor completa los campos obligatorios.",
      });
      return;
    }
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!okEmail) {
      setStatus({ type: "danger", msg: "Ingresa un correo válido." });
      return;
    }
    // Teléfono opcional
    if (form.phone && !/^[-+() 0-9]{6,20}$/.test(form.phone)) {
      setStatus({ type: "danger", msg: "Ingresa un teléfono válido." });
      return;
    }

    try {
      setLoading(true);

      // ⬇️ Envío como form-data (coincide con tu prueba cURL #1)
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("message", form.message);

      const res = await fetch("/contact.php", {
        method: "POST",
        // IMPORTANTE: sin headers 'Content-Type'; el navegador los pone con boundary
        body: fd,
      });

      // Si el servidor redirige (301/302), algunos hosts cambian a GET.
      // En la misma raíz no debería pasar, pero por si acaso:
      if (!res.ok) {
        // Intenta leer JSON de error si viene
        let errText = "Error enviando el mensaje";
        try {
          const maybe = await res.json();
          if (maybe?.error) errText = maybe.error;
        } catch (_) {}
        throw new Error(errText);
      }

      const data = await res.json();
      if (!data?.ok)
        throw new Error(data?.error || "Error enviando el mensaje");

      setStatus({
        type: "success",
        msg: "¡Mensaje enviado! Te contactaremos pronto.",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus({
        type: "danger",
        msg:
          "No pudimos enviar tu mensaje. Intenta más tarde o escríbenos a " +
          "eduardo.schwerter@gmail.com",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 720 }}>
      <h1 className="mb-4" style={{ color: "var(--color-secondary)" }}>
        Contáctanos
      </h1>

      {status.msg && (
        <Alert variant={status.type} role="alert" aria-live="polite">
          {status.msg}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Nombre*
          </label>
          <input
            id="name"
            className="form-control"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Tu nombre"
            disabled={loading}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Correo*
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="tucorreo@dominio.com"
            disabled={loading}
            required
          />
        </div>

        {/* Teléfono (opcional). Agrega required si lo quieres obligatorio */}
        <div className="mb-3">
          <label className="form-label" htmlFor="phone">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+56 9 1234 5678"
            disabled={loading}
            // required
          />
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="message">
            Mensaje*
          </label>
          <textarea
            id="message"
            className="form-control"
            name="message"
            rows="5"
            value={form.message}
            onChange={onChange}
            placeholder="Cuéntanos sobre tu proyecto…"
            disabled={loading}
            required
          />
        </div>

        <Button
          type="submit"
          className="btn-brand-white btn-xxl"
          disabled={loading}
          style={{ backgroundColor: "#fff", color: "var(--color-primary)" }}>
          {loading ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </form>
    </Container>
  );
}
