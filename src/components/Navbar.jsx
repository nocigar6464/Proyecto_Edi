import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function ColorSchemesExample() {
  return (
    <Navbar className="navbar-canlab" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">CanLAB</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#pricing">Cotizador</Nav.Link>
          <Nav.Link href="mailto:eduardo.schwerter@gmail.com?subject=CanLAB&body=Hola, quiero más información.">
            Contáctanos
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default ColorSchemesExample;
