"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientNameForm() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    // Aquí puedes guardar el nombre en Supabase o en tu flujo principal
    alert(`Nombre recibido: ${name}`);

    // Redirigir después de enviar
    router.push("/clients");
  };

  const handleCancel = () => {
    // Redirigir al cancelar
    router.push("/clients");
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h3>Enter Your Name</h3>

      <label htmlFor="clientName">Name:</label>
      <input
        id="clientName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
      />

      <div className="form-actions">
        <button type="submit">Continue</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}
