"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function WaiterTablesPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTables();
    
    // SUSCRIPCIÓN EN TIEMPO REAL: Para que las mesas se actualicen solas
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        () => loadTables()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTables = async () => {
    // Traemos las mesas y adjuntamos el último pedido pendiente si existe
    const { data, error } = await supabase
      .from("mesas")
      .select(`*`)
      .order("numero", { ascending: true });

    if (error) console.error(error);
    setTables(data || []);
    setLoading(false);
  };

  const updateTableStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("mesas")
      .update({ estado: newStatus })
      .eq("id", id);

    if (error) alert("Error al actualizar estado");
  };

  const goToOrder = (tableId: string) => {
    router.push(`/waiter/charge`);
  };

  if (loading) return <p className="p-10 text-center">Cargando panel de control...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-800 uppercase italic">Gestión de Mesas</h1>
        <div className="flex gap-2">
           <span className="flex items-center gap-1 text-xs font-bold"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Libre</span>
           <span className="flex items-center gap-1 text-xs font-bold"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Ocupada</span>
           <span className="flex items-center gap-1 text-xs font-bold"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Atendiendo</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tables.map((table) => {
          // Buscamos si hay algún pedido que no esté pagado o finalizado
          const activeOrder = table.pedidos?.find((p: any) => p.estado !== "pagado");

          return (
            <div
              key={table.id}
              className={`relative bg-white rounded-2xl shadow-lg border-t-8 p-5 transition-all
                ${table.estado === "libre" ? "border-green-500" : 
                  table.estado === "ocupada" ? "border-red-500" : "border-blue-500"}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-700">Mesa {table.numero}</h2>
                  <p className="text-xs font-bold uppercase text-gray-400">{table.estado}</p>
                </div>
                {activeOrder && (
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-[10px] font-black animate-pulse">
                    PEDIDO: {activeOrder.estado.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Acciones del Mesero */}
              <div className="space-y-2">
                <button
                  onClick={() => goToOrder(table.id)}
                  className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition"
                >
                  Ver / Crear Comanda
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {table.estado === "libre" ? (
                    <button
                      onClick={() => updateTableStatus(table.id, "ocupada")}
                      className="bg-red-50 text-red-600 py-2 rounded-lg text-[10px] font-bold border border-red-200"
                    >
                      Marcar Ocupada
                    </button>
                  ) : (
                    <button
                      onClick={() => updateTableStatus(table.id, "libre")}
                      className="bg-green-50 text-green-600 py-2 rounded-lg text-[10px] font-bold border border-green-200"
                    >
                      Liberar Mesa
                    </button>
                  )}
                  
                  <button
                    onClick={() => updateTableStatus(table.id, "atendiendo")}
                    className="bg-blue-50 text-blue-600 py-2 rounded-lg text-[10px] font-bold border border-blue-200"
                  >
                    Atendiendo
                  </button>
                </div>
              </div>

              {activeOrder && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 text-center">
                  <p className="text-sm font-bold text-gray-600">Total: ${activeOrder.total?.toFixed(2)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}