"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FreeTableForm() {
  const router = useRouter();
  const [tableId, setTableId] = useState<string | null>(null);

  useEffect(() => {
    setTableId(localStorage.getItem("mesa_id"));
  }, []);

  const handleConfirm = async () => {
    if (!tableId) return;

    try {
      // Actualizamos el estado de la mesa en Supabase
      const { error } = await supabase
        .from("mesas")
        .update({ estado: "libre" })
        .eq("id", tableId);

      if (error) throw error;

      alert(`La mesa ${tableId} ahora está disponible.`);
      router.push("/waiters");
    } catch (err) {
      console.error(err);
      alert("No se pudo liberar la mesa.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center mt-20">
      <h3 className="text-2xl font-bold mb-4 text-red-600">Liberar Mesa {tableId}</h3>
      <p className="text-gray-600 mb-8">
        ¿Estás seguro de que deseas marcar esta mesa como libre? 
        Esta acción no registrará ningún pago.
      </p>

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleConfirm}
          className="bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700"
        >
          Sí, liberar mesa
        </button>
        <button 
          onClick={() => router.push("/waiters")}
          className="bg-gray-100 text-gray-700 py-3 rounded-md hover:bg-gray-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}