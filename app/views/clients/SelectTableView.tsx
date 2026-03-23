"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Mesa = {
  id: string;
  numero: number;
  estado: "libre" | "ocupada" | "servida";
};

export default function SelectTable() {
  const [tables, setTables] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadTables = async () => {
      const { data, error } = await supabase
        .from("mesas")
        .select("*")
        .order("numero", { ascending: true });
      if (error) {
        console.error(error);
        return;
      }
      setTables(data || []);
      setLoading(false);
    };
    loadTables();
  }, []);

  const selectTable = (table: Mesa) => {
    if (table.estado !== "libre") {
      alert("Lo sentimos, esta mesa no está disponible.");
      return;
    }
    localStorage.setItem("mesa_id", table.id);
    router.push("/clients/order");
  };

  if (loading) return <div className="p-10 text-center font-bold">Cargando mapa de mesas...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-black mb-2 text-center text-gray-800 uppercase italic">
        Selecciona tu Mesa
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm">
        Si la mesa está <span className="text-green-600 font-bold">verde</span> está disponible, 
        <span className="text-red-600 font-bold"> roja</span> ocupada, 
        y <span className="text-orange-600 font-bold"> naranja</span> servida.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {tables.map((table) => {
          const isLibre = table.estado === "libre";
          const isOcupada = table.estado === "ocupada";
          const isServida = table.estado === "servida";

          let colorClass = "";
          if (isLibre) colorClass = "bg-green-100 text-green-700 border-green-500";
          if (isOcupada) colorClass = "bg-red-100 text-red-700 border-red-500";
          if (isServida) colorClass = "bg-orange-100 text-orange-700 border-orange-500";

          return (
            <button
              key={table.id}
              onClick={() => selectTable(table)}
              disabled={!isLibre}
              className={`relative p-8 rounded-2xl font-black text-2xl transition-all duration-200 border-b-4 flex flex-col items-center justify-center gap-1 ${colorClass}`}
            >
              <span className="text-[10px] uppercase tracking-widest opacity-60">Mesa</span>
              <span className="text-3xl">🪑</span>
              {table.numero}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button onClick={() => router.back()} className="px-4 py-2 bg-gray-300 rounded">
          Atrás
        </button>
        <button onClick={() => router.push("/")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Inicio
        </button>
      </div>

      <p className="mt-12 text-center text-gray-400 text-xs italic">
        Si tu mesa aparece ocupada por error, contacta a un mesero.
      </p>
    </div>
  );
}
