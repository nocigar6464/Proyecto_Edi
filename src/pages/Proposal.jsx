// src/pages/Proposal.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Financiamiento from "../components/Financiamiento";
import Listado from "../components/Listado";
import { loadWizard } from "../services/wizardStore";
import { api } from "../services/api";

// === Imágenes (como en el carrusel) ===
import imgBeer from "../assets/images/cerveza.png";
import imgBeerAlt from "../assets/images/cerveza_lajoda.jpeg"; 
import imgReady from "../assets/images/readytodrink.png";
import imgGinTonic from "../assets/images/ejemplo_gintonic.png";
import imgColdBrew from "../assets/images/coldbrew.png";
import imgFallback from "../assets/images/can_base.png";

// Elige imagen según ramo/respuestas
function pickImage(branch, answers = {}) {
  if (branch === "ready") {
    const sabor = String(answers.sabor || "").toLowerCase();
    if (sabor === "gin tonic") return imgGinTonic || imgReady;
    return imgReady;
  }
  if (branch === "coldbrew") return imgColdBrew;
  if (branch === "beer") {
    const estilo = String(answers.estilo || "").toLowerCase();
    if (estilo.includes("ipa")) return imgBeerAlt || imgBeer;
    return imgBeer;
  }
  return imgFallback;
}

function extractCantidad(answers = {}) {
  return (
    answers.cantidad ??
    answers["Cantidad a producir"] ??
    answers["Cantidad a producir "] ??
    "—"
  );
}

function buildDetails(branch, answers = {}) {
  const orderMap = {
    ready: ["sabor", "formato"],
    coldbrew: ["leche", "nitro", "mlproducto"],
    beer: ["estilo"],
  };
  const keys = orderMap[branch] || [];
  return keys
    .map((k) => answers?.[k])
    .filter((v) => v != null && String(v).trim() !== "")
    .join(" · ");
}

export default function Proposal() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [authChecked, setAuthChecked] = useState(false);
  const [authOk, setAuthOk] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await api.status();
        if (!mounted) return;
        setAuthOk(Boolean(s?.authenticated));
      } catch {
        if (!mounted) return;
        setAuthOk(false);
      } finally {
        if (mounted) setAuthChecked(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Si no viene state (clic desde correo), trae del store (sessionStorage/localStorage)
  const data = useMemo(() => {
    if (state?.answers) return state;
    return loadWizard();
  }, [state]);

  // Redirecciones según estado
  useEffect(() => {
    if (!authChecked) return;
    if (!authOk) {
      navigate("/login", { replace: true });
      return;
    }
    if (authOk && !data?.answers) {
      navigate("/cotizador", { replace: true });
    }
  }, [authChecked, authOk, data, navigate]);


  if (!authChecked || !authOk || !data?.answers) return null;

  const { branch, branchLabel, answers } = data;
  const img = pickImage(branch, answers);
  const qty = extractCantidad(answers);
  const details = buildDetails(branch, answers);

  return (
    <Container className="py-5" style={{ maxWidth: 960 }}>
      <h1 className="mb-4 text-center">Propuesta</h1>

      <div className="mb-4">
        <h2 className="h4 mb-3 text-center">
          Tu producción de <strong>{branchLabel}</strong>
          {details ? (
            <>
              {" "}
              — <span className="text-muted">{details}</span>
            </>
          ) : null}
        </h2>

        <Card className="shadow-sm">
          <Card.Img
            src={img}
            alt={branchLabel}
            style={{ maxHeight: 320, objectFit: "cover" }}
          />
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
