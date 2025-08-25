import React, { useRef } from "react";
import { Card } from "react-bootstrap";
import "./Formasdepago.css";

const defaultItems = [
  /* Aqui se editan las formas de pago disponibles*/
  { title: "Transferencia", text: "70% antes • 30% entrega • 5% dcto" },
  { title: "Tarjeta de crédito", text: "3, 6, 9, 12 cuotas sin interés" },
  { title: "Empresa", text: "OC • 30/60 días" },
];

export default function MiniCarouselHorizontal({
  items = defaultItems,
  title = "Formas de financiamiento",
}) {
  const trackRef = useRef(null);

  const scrollByPage = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth - 32), behavior: "smooth" });
  };

  return (
    <section className="mc-hz">
      {title && <h2 className="mc-hz__title">{title}</h2>}

      <div ref={trackRef} className="mc-hz__track">
        {items.map((it, i) => (
          <Card key={i} className="mc-hz__card text-center">
            <Card.Body>
              <Card.Title className="mb-2">{it.title}</Card.Title>
              <Card.Text className="mb-0">{it.text}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </section>
  );
}
