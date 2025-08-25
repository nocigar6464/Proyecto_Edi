import React from "react";
import Carousel from "../components/Carousel.jsx";
import Proceso from "../components/Proceso.jsx";
import Listado from "../components/Listado.jsx";
import Formasdepago from "../components/Formasdepago.jsx";
import Ejemplosproyectos from "../components/Ejemplosproyectos.jsx";

export default function Home() {
  return (
    <main>
      <section id="hero">
        <Carousel />
      </section>

      <section id="proceso">
        <Proceso />
      </section>

      <section id="listado">
        <Listado />
      </section>

      <section id="financiamiento">
        <Formasdepago />
      </section>

      <section id="ejemplos">
        <Ejemplosproyectos />
      </section>
    </main>
  );
}
