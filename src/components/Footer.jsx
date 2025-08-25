import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { HashLink } from "react-router-hash-link";
import Nav from "react-bootstrap/Nav";

function Footer() {
  return (
    <Container className="py-4">
      <Row className="align-items-center">
        <Col md={4} className="text-center text-md-start">
          <img
            src="/logo_canlab_transparente.png"
            alt="logo canlab"
            className="img-fluid"
            style={{ maxWidth: "220px", height: "auto" }}
          />
        </Col>

        <Col
          md={8}
          className="d-flex justify-content-center justify-content-md-end">
          <nav className="d-flex flex-column gap-2 text-center text-md-end">
            <Nav.Link as={HashLink} to="/#proceso" smooth>
              ¿Cómo funciona?
            </Nav.Link>
            <Link to="/faq">Preguntas frecuentes</Link>
            <Link to="/terminos">Términos y Condiciones</Link>
            <Link to="/privacidad">Política de privacidad</Link>
          </nav>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
