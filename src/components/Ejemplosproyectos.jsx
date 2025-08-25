// src/components/Ejemploproyectos.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Ejemplosproyectos.css";

// IMÁGENES
import cervezaLajoda from "../assets/images/cerveza_lajoda.jpeg";
import espresso1 from "../assets/images/onze_espressomartini.jpeg";
import piscosour1 from "../assets/images/onze_piscosour.jpeg";
import matri1 from "../assets/images/matrimonio.jpg";
import coldbrew1 from "../assets/images/coldbrewcoffee.jpg";

// VIDEO (IMPORTA el mp4)
import espressoVideo from "../assets/videos/espresso-martini.mp4";
import coldbrewvideo1 from "../assets/videos/coldbrew.mp4";

const proyectos = [
  { type: "video", src: espressoVideo, alt: "video espresso martini" },
  { type: "image", src: coldbrew1, alt: "Café prensado en frío" },
  { type: "video", src: coldbrewvideo1, alt: "Video cold brew" },
  { type: "image", src: cervezaLajoda, alt: "Cerveza" },
  { type: "image", src: espresso1, alt: "Espresso Martini" },
  { type: "image", src: piscosour1, alt: "Pisco Sour" },
  { type: "image", src: matri1, alt: "Recuerdo matrimonio" },
];

export default function Ejemploproyectos() {
  return (
    <section className="projects-section">
      <Container>
        <h2 className="projects-title mb-4">Algunos de nuestros proyectos</h2>
        <Row className="g-3">
          {proyectos.map((p, i) => (
            <Col key={i} xs={12} sm={6} md={3}>
              <div className="project-card">
                {p.type === "video" ? (
                  <video
                    className="project-media"
                    src={p.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={p.alt}
                  />
                ) : (
                  <img
                    className="project-media"
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                  />
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
