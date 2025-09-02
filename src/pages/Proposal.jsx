// src/pages/Proposal.jsx
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Financiamiento from "../components/Financiamiento";
import Listado from "../components/Listado";

function pickImage(branch, answers) {
  if (branch === "ready") {
    if (answers.sabor === "Gin Tonic") {
      if (
        String(answers.formato || "")
          .toLowerCase()
          .includes("350")
      )
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
  // ready usa "cantidad" (litros). beer/coldbrew usan "Cantidad a producir" (latas)
  return (
    answers.cantidad ||
    answers["Cantidad a producir"] ||
    answers["Cantidad a producir "] ||
    "—"
  );
}

// Construye el detalle que va justo después de {branchLabel}
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

// Verifica cookie de autenticación puesta por verify.php (dominio real)
function hasAuthCookie() {
  return document.cookie.split("; ").some((c) => c.startsWith("canlab_auth=1"));
}

export default function Proposal() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // 1) Proteger ruta: si no hay cookie de verificación, ir a /login
  useEffect(() => {
    if (!hasAuthCookie()) navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Si no viene state (caso típico tras clic del mail), recuperar wizardData del sessionStorage
  const data = useMemo(() => {
    if (state?.answers) return state;
    try {
      const stored = sessionStorage.getItem("wizardData");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [state]);

  // 3) Si (aun verificado) no hay datos de propuesta, volver al cotizador
  useEffect(() => {
    if (hasAuthCookie() && !data?.answers) {
      navigate("/cotizador");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
            <>
              {" "}
              — <span className="text-muted">{details}</span>
            </>
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
