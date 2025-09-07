// src/pages/CotizadorWizard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Container, Card, Button, ProgressBar, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CotizadorWizard.css";

// ⬇️ NUEVO: guardamos el wizard en sessionStorage + localStorage
import { saveWizard } from "../services/wizardStore";

const BRANCHES = {
  start: [
    {
      key: "category",
      type: "choice",
      question: "¿Qué tipo de productos te interesa fabricar?  ",
      options: [
        { value: "beer", label: "Cerveza" },
        { value: "ready", label: "Cócteles" },
        { value: "coldbrew", label: "Cold Brew Coffee" },
        {
          value: "otro",
          label: "Aguas, Hard Sezltzer, Bebidas funcionales, Gin, Otro",
        },
      ],
    },
  ],
  ready: [
    {
      key: "sabor",
      type: "choice",
      question: "Sabor base",
      options: ["Gin Tonic", "Pisco Sour", "Espresso Martini", "Otro"],
    },
    {
      key: "formato",
      type: "choice",
      question: "En qué formato deseas el producto?",
      options: ["Lata 350ml", "Lata 473 ml", "Barril Plastico", "Granel"],
    },
    {
      key: "cantidad",
      type: "number",
      question:
        "¿Qué cantidad estimada necesitas para la primera producción? (mínimo 500 L)",
      min: 500,
      unit: "L",
    },
  ],
  coldbrew: [
    {
      key: "leche",
      type: "choice",
      question: "¿Quieres que tenga alguna leche vegetal?",
      options: ["Avena", "Almendra", "Sin leche"],
    },
    {
      key: "nitro",
      type: "choice",
      question: "¿Quieres una espuma cremosa?",
      options: ["Sí", "No"],
    },
    {
      key: "mlproducto",
      type: "choice",
      question: "¿Cuántos ml quieres en la lata? ",
      options: ["290 ml", "330 ml", "350 ml"],
    },
    {
      key: "Cantidad a producir",
      type: "number",
      question: "Cantidad de latas que necesitas (mínimo 500)",
      min: 500,
      unit: "unidades",
    },
  ],
  beer: [
    {
      key: "estilo",
      type: "choice",
      question: "Estilo de cerveza",
      options: ["Lager", "Pale Ale/Ambar/Stout", "IPA", "Otro"],
    },
    {
      key: "Cantidad a producir",
      type: "number",
      question: "Cantidad de latas que necesitas (enlatado 473cc, mínimo 500)",
      min: 500,
      unit: "unidades",
    },
  ],
};

export default function CotizadorWizard() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("start"); // start | flow
  const [branch, setBranch] = useState(null); // ready | coldbrew | beer
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [notice, setNotice] = useState("");

  // valor temporal para inputs numéricos
  const [inputVal, setInputVal] = useState("");

  // Mapa value->label para la categoría inicial (beer→Cerveza, etc.)
  const CATEGORY_LABELS = useMemo(() => {
    const opts = BRANCHES.start[0].options;
    const map = {};
    opts.forEach((o) => (map[o.value] = o.label));
    return map;
  }, []);

  const steps = useMemo(() => {
    if (phase === "start") return BRANCHES.start;
    if (!branch) return [];
    return BRANCHES[branch] || [];
  }, [phase, branch]);

  const current = steps[step];
  const totalSteps = steps.length || 1;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  // inicializa inputVal cuando el paso actual es numérico
  useEffect(() => {
    if (current?.type === "number") {
      const prev = answers[current.key];
      setInputVal(prev != null ? String(prev) : "");
    } else {
      setInputVal("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, current?.type, current?.key]);

  const selectOption = (value) => {
    const key = current.key;
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);

    // Paso 1: selección de categoría
    if (phase === "start" && key === "category") {
      if (value === "otro") {
        setNotice(
          "Requerimos más información para cotizar tu producto. Te redirigiremos al formulario…"
        );
        setTimeout(() => {
          window.location.href = "/contacto";
        }, 2000);
        return;
      }
      setBranch(value);
      setPhase("flow");
      setStep(0);
      return;
    }

    // Avanza en el flujo o navega a LOGIN al terminar
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // ÚLTIMO PASO → guardar datos y llevar a /login
      const payload = {
        branch,
        branchLabel: CATEGORY_LABELS[branch],
        answers: nextAnswers,
      };

      // ⬇️ CAMBIO CLAVE: persistimos en sessionStorage + localStorage
      saveWizard(payload);

      navigate("/login");
    }
  };

  // enviar valor numérico validado
  const submitNumber = () => {
    const min = Number(current?.min ?? 0);
    const n = Number(inputVal);
    if (!Number.isFinite(n) || n < min) return;
    selectOption(n); // guardamos como número
  };

  const goBack = () => {
    if (phase === "flow" && step === 0) {
      setPhase("start");
      setBranch(null);
      setStep(0);
      return;
    }
    if (phase === "flow" && step > 0) {
      setStep(step - 1);
    }
  };

  const resetAll = () => {
    setPhase("start");
    setBranch(null);
    setStep(0);
    setAnswers({});
    setNotice("");
  };

  const isNumberStep = current?.type === "number";
  const minForStep = Number(current?.min ?? 0);
  const numberValid =
    isNumberStep &&
    Number.isFinite(Number(inputVal)) &&
    Number(inputVal) >= minForStep;

  return (
    <div className="wizard-screen">
      <Container>
        <Card className="wizard-card">
          <Card.Body>
            <h1 className="wizard-title">Cotizador</h1>

            {notice && (
              <Alert variant="warning" className="mb-3">
                {notice}
              </Alert>
            )}

            <div className="wizard-progress">
              <ProgressBar now={phase === "start" ? 0 : progress} />
            </div>

            <h2 className="wizard-question">{current?.question || "—"}</h2>

            {/* RENDERIZADO SEGÚN TIPO */}
            {!isNumberStep && (
              <div className="wizard-options">
                {current?.options?.map((opt) => {
                  const value = typeof opt === "string" ? opt : opt.value;
                  const label = typeof opt === "string" ? opt : opt.label;
                  return (
                    <Button
                      key={value}
                      variant="light"
                      className="wizard-option"
                      onClick={() => selectOption(value)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            )}

            {isNumberStep && (
              <div style={{ maxWidth: 420 }}>
                <input
                  type="number"
                  min={minForStep}
                  step="1"
                  className="form-control form-control-lg"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && numberValid) submitNumber();
                  }}
                  placeholder={`Mínimo ${minForStep} ${
                    current?.unit || "unidades"
                  }`}
                />
                <div className="d-flex gap-2 mt-3">
                  {phase === "flow" && (
                    <Button variant="outline-secondary" onClick={goBack}>
                      Atrás
                    </Button>
                  )}
                  <Button onClick={submitNumber} disabled={!numberValid}>
                    Siguiente
                  </Button>
                  <Button variant="outline-danger" onClick={resetAll}>
                    Reiniciar
                  </Button>
                </div>
                {!numberValid && inputVal !== "" && (
                  <small className="text-danger d-block mt-2">
                    Ingresa un número válido (mínimo {minForStep}).
                  </small>
                )}
              </div>
            )}

            {/* Acciones estándar solo para pasos de elección */}
            {!isNumberStep && (
              <div className="wizard-actions mt-3">
                {phase === "flow" && (
                  <Button variant="outline-secondary" onClick={goBack}>
                    Atrás
                  </Button>
                )}
                <Button variant="outline-danger" onClick={resetAll}>
                  Reiniciar
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
