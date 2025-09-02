import React from "react";
import { Card } from "react-bootstrap";
import "./Listado.css";

// Datos que se muestran en el lista de "CanLAB se encarga de todo" (puedes editarlos aquí)
const defaultItems = [
  {
    title: "SIN Inversión inicial",
    text: "No necesitas equipos, utensilios ni maquinaria. Minimiza el riesgo de tu negocio",
  },
  {
    title: "Bajo MOQ",
    text: "Desde 500 unidades",
  },
  {
    title: "Permisos",
    text: "R.S. , Patentes, Inscribimos tu producto en el SAG",
  },
  {
    title: "SIN Personal",
    text: "No te preocupes de remuneraciones, contratos, vacaciones o licencias",
  },
  {
    title: "Producción",
    text: "Tenemos recetas base que pueden ser customizadas por tí, ¿quieres aportar tu cafe u otro ingrediente?",
  },
  {
    title: "Etiquetado",
    text: "Aporta tu diseño y vemos que cumplas con la Ley de etiquetado y código de barras",
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
