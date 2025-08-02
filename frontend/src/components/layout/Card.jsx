// frontend/src/components/layout/Card.jsx
import React from "react";

function Card({ title, children }) {
  return (
    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      {title && (
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
      )}
      {children}
    </section>
  );
}

export default Card;
