"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SelectTable() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadTables = async () => {
      const { data } = await supabase.from("mesas").select("*").order("numero", { ascending: true });
      setTables(data || []);
      setLoading(false);
    };
    loadTables();
  }, []);

  const selectTable = (table: any) => {
    if (table.estado !== "libre") {
      alert("Lo sentimos, esta mesa no está disponible en este momento.");
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
        Toca una mesa en verde para comenzar tu pedido
      </p>

      {/* Referencia de Estados */}
      <div className="flex justify-center gap-4 mb-10">
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-xs font-bold text-gray-600 uppercase">Disponible</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="text-xs font-bold text-gray-600 uppercase">Ocupada</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {tables.map((table) => {
          const isLibre = table.estado === "libre";

          return (
            <button
              key={table.id}
              onClick={() => selectTable(table)}
              disabled={!isLibre}
              className={`
                relative p-8 rounded-2xl font-black text-2xl transition-all duration-200 border-b-4
                flex flex-col items-center justify-center gap-1
                ${isLibre 
                  ? "bg-white border-green-500 text-green-600 shadow-md hover:translate-y-[-4px] active:translate-y-[0px] active:border-b-0" 
                  : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-70"
                }
              `}
            >
              <span className="text-[10px] uppercase tracking-widest opacity-60">Mesa</span>
              {table.numero}
              
              {/* Etiqueta de estado dentro de la tarjeta */}
              <span className={`text-[9px] px-2 py-0.5 rounded-full mt-2 uppercase tracking-tighter ${
                isLibre ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}>
                {isLibre ? "libre" : " ocupada"}
              </span>

              {/* Punto de luz para mesas ocupadas */}
              {!isLibre && (
                <span className="absolute top-3 right-3 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-12 text-center text-gray-400 text-xs italic">
        Si tu mesa aparece ocupada por error, contacta a un mesero.
      </p>
    </div>
  );
}