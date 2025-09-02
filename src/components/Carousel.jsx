// CanlabCarousel.jsx
import Carousel from "react-bootstrap/Carousel";
import ExampleCarouselImage from "./ExampleCarouselImage.jsx";
import Button from "react-bootstrap/Button";

// IMPORTA las imágenes (ajusta la ruta según tu estructura real)
import gondola2 from "../assets/images/gondola2.png";
import craftbanana from "../assets/images/craft_banana.png";
import coldbrew from "../assets/images/coldbrew1.png";

export default function CanlabCarousel() {
  return (
    <Carousel>
      <Carousel.Item>
        <ExampleCarouselImage src={gondola2} alt="Góndola" />
        <Carousel.Caption>
          <Button
            className="btn-brand-white btn-xxl"
            href="mailto:eduardo.schwerter@gmail.com?subject=CanLAB&body=Hola, quiero más información.">
            Cotiza
          </Button>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <ExampleCarouselImage src={craftbanana} alt="Bebida funcional" />
        <Carousel.Caption>
          <Button
            className="btn-brand-white btn-xxl"
            href="mailto:eduardo.schwerter@gmail.com?subject=CanLAB&body=Hola, quiero más información.">
            Cotiza
          </Button>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <ExampleCarouselImage src={coldbrew} alt="Imagen cold brew coffee" />
        <Carousel.Caption>
          <Button
            className="btn-brand-white btn-xxl"
            href="mailto:eduardo.schwerter@gmail.com?subject=CanLAB&body=Hola, quiero más información.">
            Cotiza
          </Button>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
