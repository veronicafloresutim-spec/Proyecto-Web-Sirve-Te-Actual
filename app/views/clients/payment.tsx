"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Item = {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  productos: { nombre: string } | null;
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
    const { data, error } = await supabase
      .from("detalle_pedido")
      .select(`
        producto_id,
        cantidad,
        precio_unitario,
        productos(nombre)
      `)
      .eq("pedido_id", pedido_id);

    if (error) {
      console.error("Error cargando detalle:", error);
      return;
    }

    // ✅ Transformamos sin usar (d: any)
    const typedData: Item[] = (data ?? []).map((d) => ({
      producto_id: String(d.producto_id),
      cantidad: Number(d.cantidad),
      precio_unitario: Number(d.precio_unitario),
      productos: Array.isArray(d.productos) ? d.productos[0] ?? null : d.productos,
    }));

    setItems(typedData);

    const sum = typedData.reduce(
      (acc, item) => acc + item.precio_unitario * item.cantidad,
      0
    );
    setTotal(sum);
  };

  const payOrder = async () => {
    if (!orderId) return;
    setLoading(true);

    try {
      const { data: pedido, error: errPed } = await supabase
        .from("pedidos")
        .select("mesa_id")
        .eq("id", orderId)
        .single();

      if (errPed) throw new Error("No se pudo encontrar la mesa del pedido");

      const { error: errPago } = await supabase
        .from("pagos")
        .insert({
          pedido_id: orderId,
          monto: total,
          metodo: "efectivo",
        });
      if (errPago) throw errPago;

      const { error: errUpdatePed } = await supabase
        .from("pedidos")
        .update({ estado: "pagado" })
        .eq("id", orderId);
      if (errUpdatePed) throw errUpdatePed;

      if (pedido?.mesa_id) {
        const { error: errMesa } = await supabase
          .from("mesas")
          .update({ estado: "libre" })
          .eq("id", pedido.mesa_id);
        if (errMesa) throw errMesa;
      }

      localStorage.removeItem("pedido_id");
      alert("¡Gracias por su visita! Pago procesado y mesa liberada.");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error en el proceso:", error.message);
        alert("Error en el proceso: " + error.message);
      } else {
        console.error("Error desconocido:", error);
        alert("Error inesperado en el proceso.");
      }
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
          <p className="text-sm uppercase tracking-widest opacity-70">
            Total a Pagar
          </p>
          <h2 className="text-4xl font-bold">${total.toFixed(2)}</h2>
        </div>

        <div className="p-6">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-3">
            Resumen de consumo
          </h3>
          <div className="space-y-3 mb-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  <span className="font-bold text-blue-600">{item.cantidad}x</span>{" "}
                  {item.productos?.nombre}
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
                loading
                  ? "bg-gray-300"
                  : "bg-green-500 hover:bg-green-600 text-white active:scale-95"
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
