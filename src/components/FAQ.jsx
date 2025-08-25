import React from 'react'

const faqs = [
  { q: "¿Qué volúmenes manejan?", a: "Desde lotes piloto hasta producción para pymes y marcas establecidas." },
  { q: "¿Pueden ayudarme con la receta?", a: "Sí, ofrecemos I+D, estandarización y documentación de procesos." },
  { q: "¿Qué tipos de bebidas trabajan?", a: "RTD, kombucha, bebidas probióticas, cold brew y más." },
]

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="text-center">
        <h2 className="section-title">Preguntas frecuentes</h2>
        <p className="section-subtitle mx-auto">Resolvemos las dudas más comunes.</p>
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {faqs.map((f, i) => (
          <details key={i} className="card p-5 open:shadow-md">
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
