// src/App.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

// Componentes base
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Páginas
import Home from "./pages/Home.jsx";
import FAQ from "./pages/FAQ.jsx";
import Terminos from "./pages/Terminos.jsx";
import Privacidad from "./pages/Privacidad.jsx";
import Proposal from "./pages/Proposal.jsx";
import Contacto from "./pages/Contacto.jsx";
import CotizadorWizard from "./pages/CotizadorWizard.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cotizador" element={<CotizadorWizard />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </>
  );
}
