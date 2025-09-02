// src/components/Ejemploproyectos.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Ejemplosproyectos.css";

// IMÁGENES
import cervezaLajoda from "../assets/images/cerveza_lajoda.jpeg";
import espresso1 from "../assets/images/ejemplo_martini.png";
import piscosour1 from "../assets/images/ejemplo_piscosour.png";
import matri1 from "../assets/images/matrimonio.jpg";
import craftcola from "../assets/images/ejemplo_craft_cola.png";
import craftorange from "../assets/images/ejemplo_orange_spritz.png";
import craftlemon from "../assets/images/ejemplo_ginger.png";

// VIDEO (IMPORTA el mp4)
import espressoVideo from "../assets/videos/espresso-martini.mp4";
import coldbrewvideo1 from "../assets/videos/coldbrew.mp4";
import gintonicvideo from "../assets/videos/video_gin.mp4";

const proyectos = [
  { type: "video", src: espressoVideo, alt: "video espresso martini" },
  { type: "image", src: craftorange, alt: "Bebida naranja artesanal" },
  { type: "image", src: piscosour1, alt: "Pisco Sour" },
  { type: "image", src: matri1, alt: "Recuerdo matrimonio" },
  { type: "image", src: cervezaLajoda, alt: "Cerveza" },
  { type: "image", src: espresso1, alt: "Espresso Martini" },
  { type: "video", src: coldbrewvideo1, alt: "Video cold brew" },
  { type: "image", src: craftcola, alt: "Coca cola artesanal" },
  { type: "video", src: gintonicvideo, alt: "Video gin tonic" },
  { type: "image", src: craftlemon, alt: "Bebida artesanal limon" },
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
