import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

/* páginas */
import Home from "./pages/Home.jsx";
import FAQ from "./pages/FAQ.jsx";
import Terminos from "./pages/Terminos.jsx";
import Privacidad from "./pages/Privacidad.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
      </Routes>

      <Footer />
    </>
  );
}
