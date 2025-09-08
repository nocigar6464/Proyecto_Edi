import { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { api } from "../services/api";

const PRICE_URL = `${import.meta.env.BASE_URL || "/"}pricing.json`;

function formatCLP(n) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Financiamiento({ branch, answers }) {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const qty = Number(
    answers?.cantidad ??
      answers?.["Cantidad a producir"] ??
      answers?.["Cantidad a producir "] ??
      0
  );

  // Cargar pricing.json
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(PRICE_URL);
        const data = await r.json();
        if (mounted) {
          setPricing(data);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setPricing(null);
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Precio base según branch/cantidad + overrides
  const basePrice = useMemo(() => {
    if (!pricing || !branch || !qty) return 0;

    const table = pricing[branch];
    if (!table) return 0;

    // buckets A/B/C/D por cantidad
    let bucket = "A";
    if (qty >= 2000 && qty < 10000) bucket = "C";
    else if (qty >= 500 && qty < 2000) bucket = "B";
    else if (qty >= 10000) bucket = "D";

    // Overrides (ej: ready → Gin Tonic 350ml por tramos)
    if (
      branch === "ready" &&
      answers?.sabor === "Gin Tonic" &&
      /350/.test(String(answers?.formato || ""))
    ) {
      const o = pricing.overrides ?? {};
      if (qty < 500 && o["ready::Gin Tonic::Lata 350ml::menos de 500L"]) {
        return o["ready::Gin Tonic::Lata 350ml::menos de 500L"];
      }
      if (
        qty >= 500 &&
        qty < 2000 &&
        o["ready::Gin Tonic::Lata 350ml::Entre 500 - 2.000 L"]
      ) {
        return o["ready::Gin Tonic::Lata 350ml::Entre 500 - 2.000 L"];
      }
      if (
        qty >= 2000 &&
        qty < 10000 &&
        o["ready::Gin Tonic::Lata 350ml::Entre 2.000 - 10.000 L"]
      ) {
        return o["ready::Gin Tonic::Lata 350ml::Entre 2.000 - 10.000 L"];
      }
      if (qty >= 10000 && o["ready::Gin Tonic::Lata 350ml::Sobre 10.000 L"]) {
        return o["ready::Gin Tonic::Lata 350ml::Sobre 10.000 L"];
      }
    }

    return table[bucket] || 0;
  }, [pricing, branch, answers, qty]);

  const totals = useMemo(() => {
    const base = basePrice || 0;
    const transferencia = Math.round(base * 0.95); // 5% dcto
    const tarjeta = Math.round(base * 1.12); // 12 cuotas (referencia)
    return { base, transferencia, tarjeta };
  }, [basePrice]);

  async function handleQuote(plan) {
    try {
      setMsg({ type: "", text: "" });

      // 1) email desde la sesión (cookie httpOnly)
      const status = await api.status();
      const email = status?.user?.email || "";
      if (!email)
        throw new Error("No pudimos obtener tu sesión. Inicia sesión de nuevo.");

      // 2) descripción del item
      const branchLabel =
        branch === "beer"
          ? "Cerveza"
          : branch === "ready"
          ? "Cócteles"
          : branch === "coldbrew"
          ? "Cold Brew Coffee"
          : "Producto";

      const detailParts = [];
      if (answers?.estilo) detailParts.push(answers.estilo);
      if (answers?.sabor) detailParts.push(answers.sabor);
      if (answers?.formato) detailParts.push(answers.formato);
      if (answers?.mlproducto) detailParts.push(String(answers.mlproducto));

      const description = `Producción ${branchLabel}${
        detailParts.length ? " — " + detailParts.join(" · ") : ""
      }`;

      // 3) total según plan
      const total =
        plan === "transfer"
          ? totals.transferencia
          : plan === "credit"
          ? totals.tarjeta
          : totals.base;

      // 4) payload “simple” (1 ítem)
      const payload = {
        name: email,
        email,
        currency: "CLP",
        items: [{ description, quantity: 1, unitPrice: total }],
        notes: `Plan: ${plan}. Cantidad: ${qty}.`,
      };

      await api.quote(payload);
      setMsg({
        type: "success",
        text: "¡Cotización enviada! Te contactaremos pronto.",
      });
    } catch (e) {
      setMsg({
        type: "danger",
        text: e.message || "No pudimos enviar la cotización.",
      });
    }
  }

  if (loading) {
    return (
      <section className="text-center">
        <Spinner animation="border" size="sm" /> Cargando precios…
      </section>
    );
  }

  return (
    <>
      {/* Estilo embebido para los botones (paleta CanLAB) */}
      <style>{`
        .btn-canlab {
          background-color: #e0b13c !important; /* dorado */
          border-color: #e0b13c !important;
          color: #0b2f46 !important;           /* azul */
          font-weight: 600;
          line-height: 1.2;
        }
        .btn-canlab:hover,
        .btn-canlab:focus,
        .btn-canlab:active {
          background-color: #d1a233 !important; /* dorado un poco más oscuro */
          border-color: #d1a233 !important;
          color: #0b2f46 !important;
          box-shadow: none !important;
        }
      `}</style>

      <section>
        <h2 className="h4 mb-3 text-center">Elige tu financiamiento</h2>
        <p className="text-muted text-center">
          El valor de la propuesta podría estar sujeta a cambios una vez realizada la
          reunión técnica.
        </p>

        {msg.text && (
          <div className="d-flex justify-content-center">
            <Alert className="w-100" style={{ maxWidth: 760 }} variant={msg.type}>
              {msg.text}
            </Alert>
          </div>
        )}

        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
            {/* Transferencia */}
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center g-3">
                  <Col>
                    <Card.Title className="h5 mb-1">Transferencia</Card.Title>
                    <p className="mb-1">5% de descuento</p>
                    <Button size="sm" className="btn-canlab" onClick={() => handleQuote("transfer")}>
                      Solicitar cotización
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-end">
                    <div className="fw-semibold">{formatCLP(totals.transferencia)}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Tarjeta de crédito */}
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center g-3">
                  <Col>
                    <Card.Title className="h5 mb-1">Tarjeta de crédito</Card.Title>
                    <p className="mb-1">Paga en 12 cuotas con todo medio de pago</p>
                    <Button size="sm" className="btn-canlab" onClick={() => handleQuote("credit")}>
                      Solicitar cotización
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-end">
                    <div className="fw-semibold">{formatCLP(totals.tarjeta)}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Subtotal de referencia */}
            <Card className="mb-3 shadow-sm">
              <Card.Body className="d-flex justify-content-between">
                <div className="text-muted">Subtotal de referencia</div>
                <div className="fw-semibold">{formatCLP(totals.base)}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
}
