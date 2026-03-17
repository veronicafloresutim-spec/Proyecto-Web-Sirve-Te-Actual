"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ChargeForm() {
  const router = useRouter();
  
  // Obtenemos el ID de la mesa desde el localStorage (guardado cuando el mesero selecciona la mesa)
  const [tableId, setTableId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTableId(localStorage.getItem("mesa_id"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableId || amount <= 0) {
      alert("Mesa no seleccionada o monto inválido.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Buscar el pedido activo (pendiente) de esa mesa
      const { data: pedido, error: pedidoErr } = await supabase
        .from("pedidos")
        .select("id")
        .eq("mesa_id", tableId)
        .neq("estado", "pagado")
        .single();

      if (pedidoErr || !pedido) {
        alert("No se encontró un pedido activo para esta mesa.");
        setLoading(false);
        return;
      }

      // 2️⃣ Registrar el pago en la tabla 'pagos'
      const { error: pagoErr } = await supabase
        .from("pagos")
        .insert({
          pedido_id: pedido.id,
          metodo: paymentMethod,
          monto: amount,
          estado: "completado"
        });

      if (pagoErr) throw pagoErr;

      // 3️⃣ Actualizar el pedido a 'pagado'
      await supabase
        .from("pedidos")
        .update({ estado: "pagado" })
        .eq("id", pedido.id);

      // 4️⃣ Liberar la mesa automáticamente
      await supabase
        .from("mesas")
        .update({ estado: "libre" })
        .eq("id", tableId);

      alert("¡Cobro realizado y mesa liberada!");
      router.push("/waiters");

    } catch (err) {
      console.error(err);
      alert("Error inesperado al procesar el cobro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h3 className="text-xl font-bold border-b pb-2">Cobrar Mesa: {tableId}</h3>

        <label className="text-sm font-semibold">Monto Total:</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
        />

        <label className="text-sm font-semibold">Método de Pago:</label>
        <select
          className="border p-2 rounded bg-white"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
          <option value="qr">QR / CoDi</option>
        </select>

        <div className="flex gap-2 mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? "Procesando..." : "Confirmar Cobro"}
          </button>
          <button 
            type="button" 
            onClick={() => router.push("/waiters")}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}