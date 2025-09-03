// src/pages/Proposal.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Financiamiento from "../components/Financiamiento";
import Listado from "../components/Listado";
import { loadWizard } from "../services/wizardStore";

const API_URL = import.meta.env.VITE_API_URL || ""; // ej. http://localhost:3000

function pickImage(branch, answers) {
  if (branch === "ready") {
    if (answers.sabor === "Gin Tonic") {
      if (String(answers.formato || "").toLowerCase().includes("350"))
        return "/images/proposal/ready-gintonic-350.jpg";
      return "/images/proposal/ready-gintonic.jpg";
    }
    return "/images/proposal/ready.jpg";
  }
  if (branch === "coldbrew") return "/images/proposal/coldbrew.jpg";
  if (branch === "beer") {
    if (answers.estilo === "IPA") return "/images/proposal/beer-ipa.jpg";
    return "/images/proposal/beer.jpg";
  }
  return "/images/proposal/default.jpg";
}

function extractCantidad(branch, answers) {
  return (
    answers.cantidad ||
    answers["Cantidad a producir"] ||
    answers["Cantidad a producir "] ||
    "—"
  );
}

function buildDetails(branch, answers) {
  const orderMap = {
    ready: ["sabor", "formato"],
    coldbrew: ["leche", "nitro", "mlproducto"],
    beer: ["estilo"],
  };
  const keys = orderMap[branch] || [];
  const vals = keys
    .map((k) => answers?.[k])
    .filter((v) => v != null && String(v).trim() !== "");
  return vals.join(" · ");
}

export default function Proposal() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // estado de autenticación: null=pending, true=ok, false=fail
  const [authOk, setAuthOk] = useState(null);

  // 1) Proteger ruta: validar sesión contra el backend (cookie httpOnly)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/status`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        const ok = Boolean(data?.authenticated);
        if (!mounted) return;
        setAuthOk(ok);
        if (!ok) navigate("/login");
      } catch {
        if (!mounted) return;
        setAuthOk(false);
        navigate("/login");
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Si no viene state (tras clic del mail), recupera del store (session/local)
  const data = useMemo(() => {
    if (state?.answers) return state;
    return loadWizard();
  }, [state]);

  // 3) Si autenticado pero sin datos, volver al cotizador
  useEffect(() => {
    if (authOk && !data?.answers) navigate("/cotizador");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authOk, data]);

  // Espera a que termine la validación de sesión
  if (authOk === null) return null;
  if (!data?.answers) return null;

  const { branch, branchLabel, answers } = data;
  const img = pickImage(branch, answers);
  const qty = extractCantidad(branch, answers);
  const details = buildDetails(branch, answers);

  return (
    <Container className="py-5" style={{ maxWidth: 960 }}>
      <h1 className="mb-4 text-center">Propuesta</h1>

      <div className="mb-4">
        <h2 className="h4 mb-3 text-center">
          Tu producción de <strong>{branchLabel}</strong>
          {details && (
            <> — <span className="text-muted">{details}</span></>
          )}
        </h2>

        <Card className="shadow-sm">
          <Card.Img src={img} alt={`${branchLabel}`} />
          <Card.Body>
            <p className="mb-0">
              <strong>Cantidad seleccionada:</strong> {qty}
            </p>
          </Card.Body>
        </Card>
      </div>

      <div className="mb-5">
        <Financiamiento branch={branch} answers={answers} />
      </div>

      <Listado />
    </Container>
  );
}
