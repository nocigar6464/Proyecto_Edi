import React from "react";
import { Card } from "react-bootstrap";
import "./Listado.css";

// Datos que se muestran en el lista de "CanLAB se encarga de todo" (puedes editarlos aquí)
const defaultItems = [
  { title: "SIN Inversión inicial", text: "Equipos, utensilios, capital" },
  { title: "Permisos", text: "SAG, R.S., Patentes" },
  {
    title: "SIN Personal",
    text: "No te preocupes de remuneraciones, contratos, vacaciones o licencias",
  },
  {
    title: "Producción",
    text: "Diseño de recetas, pruebas, ¿quieres aportar tu cafe o alcohol?",
  },
  {
    title: "Etiquetado",
    text: "Ley de etiquetado, código de barras, aporta tu diseño o te damos 2 opciones segun tus referencias",
  },
  { title: "Embalaje", text: "Pallet y cajas listas para tu negocio" },
];

export default function MiniCarousel({ items = defaultItems, title }) {
  return (
    <section className="mini-carousel vertical">
      <h1 className="mini-title mb-4">CanLAB se encarga de todo</h1>
      {title && <h3 className="mini-subtitle mb-3">{title}</h3>}

      <div className="mini-list">
        {items.map((it, i) => (
          <Card key={i} className="mini-card text-center">
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
