"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ClientNameForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor ingresa tu nombre.");
      return;
    }

    setLoading(true);

    try {
      // Guardar nombre en Supabase (tabla clientes)
      const { data, error } = await supabase
        .from("clientes")
        .insert([{ nombre: name }])
        .select()
        .single();

      if (error) throw error;

      // Guardar en localStorage para usarlo en el pedido
      localStorage.setItem("cliente_nombre", name);
      localStorage.setItem("cliente_id", data.id);

      alert(`Bienvenido, ${name}`);

      // Redirigir al flujo de clientes
      router.push("/clients/select-table");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error al guardar cliente:", err.message);
        alert("Error al guardar el nombre: " + err.message);
      } else {
        console.error("Error desconocido:", err);
        alert("Error inesperado al guardar el nombre.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Ingresa tu Nombre</h3>

      <label htmlFor="clientName">Nombre:</label>
      <input
        id="clientName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre"
        required
        className="border rounded p-2 w-full mb-4"
      />

      <div className="form-actions flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? "Guardando..." : "Continuar"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancelar
        </button>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Inicio
        </button>
      </div>
    </form>
  );
}
