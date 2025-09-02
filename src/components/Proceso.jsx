// Proceso.jsx
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faFlask,
  faIndustry,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import "./Proceso.css"; // <-- importa estilos personalizados

export default function Proceso() {
  const steps = [
    { icon: faComment, label: "Reunión Inicial" },
    { icon: faFlask, label: "Formulación y Pruebas" },
    { icon: faIndustry, label: "Producción y Enlatado" },
    { icon: faTruck, label: "Despacho" },
  ];

  return (
    <Container className="py-4">
      <Row className="text-center gy-3">
        {steps.map((s, i) => (
          <Col key={i} xs={6} md={3}>
            <div className="step-100 d-flex flex-column align-items-center justify-content-center">
              <FontAwesomeIcon
                icon={s.icon}
                size="2x"
                className="icon-step mb-2"
              />
              <div className="fw-semibold">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
