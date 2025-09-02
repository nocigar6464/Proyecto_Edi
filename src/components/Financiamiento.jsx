import { Row, Col, Card } from "react-bootstrap";

export default function Financiamiento({ branch, answers }) {
  return (
    <section>
      <h2 className="h4 mb-3 text-center">Elige tu financiamiento</h2>
      <p className="text-muted text-center">
        El valor de la propuesta podría estar sujeta a cambios una vez realizada
        la reunión técnica.
      </p>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
          {/* Transferencia */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <Card.Title className="h5 mb-1">Transferencia</Card.Title>
                  <p className="mb-0">5% de descuento</p>
                </Col>
                <Col xs="auto" className="text-end">
                  <div className="fw-semibold">VALORX</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tarjeta de crédito */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <Card.Title className="h5 mb-1">
                    Tarjeta de crédito
                  </Card.Title>
                  <p className="mb-0">
                    Paga en 12 cuotas con todo medio de pago
                  </p>
                </Col>
                <Col xs="auto" className="text-end">
                  <div className="fw-semibold">VALORX</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
}
