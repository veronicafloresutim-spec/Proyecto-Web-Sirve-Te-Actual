"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Item = {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  productos: {
    nombre: string;
  } | null;
};

export default function PaymentPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("pedido_id");
    if (id) {
      setOrderId(id);
      loadOrder(id);
    } else {
      alert("No se encontró un pedido activo.");
      router.push("/");
    }
  }, []);

  const loadOrder = async (pedido_id: string) => {
    // Nota: Verifica si tu tabla es 'detalle_pedido' o 'detalles_pedido'
    const { data, error } = await supabase
  .from("detalle_pedido")
  .select(`
    cantidad,
    precio_unitario,
    productos(nombre)
  `)
  .eq("pedido_id", pedido_id) as { data: Item[] | null, error: any };

    if (error) {
      console.error("Error cargando detalle:", error);
      return;
    }

    const typedData = data as unknown as Item[];
    setItems(typedData || []);

    const sum = typedData?.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0);
    setTotal(sum || 0);
  };

  const payOrder = async () => {
    if (!orderId) return;
    setLoading(true);

    try {
      // 1. Obtener el ID de la mesa antes de cualquier cosa
      const { data: pedido, error: errPed } = await supabase
  .from("pedidos")
  .select("mesa_id")
  .eq("id", orderId)
  .single();

if (errPed) throw new Error("No se pudo encontrar la mesa del pedido");

      // 2. Registrar el Pago
      const { error: errPago } = await supabase
        .from("pagos")
        .insert({
          pedido_id: orderId,
          monto: total,
          metodo: "efectivo" // Aquí podrías poner un selector para tarjeta/efectivo
        });
      if (errPago) throw errPago;

      // 3. Actualizar estado del Pedido a 'pagado'
      const { error: errUpdatePed } = await supabase
        .from("pedidos")
        .update({ estado: "pagado" })
        .eq("id", orderId);
      if (errUpdatePed) throw errUpdatePed;

      // 4. Liberar la Mesa
      const { error: errMesa } = await supabase
        .from("mesas")
        .update({ estado: "libre" })
        .eq("id", pedido.mesa_id);
      if (errMesa) throw errMesa;

      // 5. Limpiar sesión y finalizar
      localStorage.removeItem("pedido_id");
      alert("¡Gracias por su visita! Pago procesado y mesa liberada.");
      router.push("/"); // Volver al inicio

    } catch (err: any) {
      console.error(err);
      alert("Error en el proceso: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black mb-6 text-center text-gray-800">
        FINALIZAR CUENTA
      </h1>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gray-800 text-white text-center">
          <p className="text-sm uppercase tracking-widest opacity-70">Total a Pagar</p>
          <h2 className="text-4xl font-bold">${total.toFixed(2)}</h2>
        </div>

        <div className="p-6">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-3">Resumen de consumo</h3>
          <div className="space-y-3 mb-6">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-700">
                <span>
                  <span className="font-bold text-blue-600">{item.cantidad}x</span> {item.productos?.nombre}
                </span>
                <span className="font-medium">
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <button
              onClick={payOrder}
              disabled={loading || total === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                loading ? "bg-gray-300" : "bg-green-500 hover:bg-green-600 text-white active:scale-95"
              }`}
            >
              {loading ? "PROCESANDO..." : "CONFIRMAR PAGO"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Al confirmar, la mesa quedará disponible para nuevos clientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}