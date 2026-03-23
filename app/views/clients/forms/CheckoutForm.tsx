"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type CartItem = {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  productos: { nombre: string } | null;
};

export default function CheckoutForm() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pedidoId = localStorage.getItem("pedido_id");
    const mesaId = localStorage.getItem("mesa_id");
    const clienteNombre = localStorage.getItem("cliente_nombre");

    setClientName(clienteNombre);

    const loadCart = async () => {
      if (!pedidoId) return;

      const { data, error } = await supabase
        .from("detalle_pedido")
        .select(`
          producto_id,
          cantidad,
          precio_unitario,
          productos(nombre)
        `)
        .eq("pedido_id", pedidoId);

      if (error) {
        console.error("Error cargando carrito:", error);
        return;
      }

      // ✅ Tipado seguro: primero unknown[], luego transformamos
      const rawData = (Array.isArray(data) ? data : []) as unknown[];

      const typedData: CartItem[] = rawData.map((rowUnknown) => {
        const row = rowUnknown as {
          producto_id: string | number;
          cantidad: string | number;
          precio_unitario: string | number;
          productos: { nombre: string }[] | null;
        };

        return {
          producto_id: String(row.producto_id),
          cantidad: Number(row.cantidad),
          precio_unitario: Number(row.precio_unitario),
          productos: Array.isArray(row.productos)
            ? row.productos[0] ?? null
            : row.productos,
        };
      });

      setCart(typedData);
    };

    const loadTable = async () => {
      if (!mesaId) return;
      const { data, error } = await supabase
        .from("mesas")
        .select("numero")
        .eq("id", mesaId)
        .single();

      if (error) {
        console.error("Error cargando mesa:", error);
        return;
      }

      setTableNumber(data?.numero || null);
    };

    loadCart();
    loadTable();
  }, []);

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.precio_unitario * item.cantidad, 0);

  const handleConfirm = async () => {
    const pedidoId = localStorage.getItem("pedido_id");
    if (!pedidoId) {
      alert("No se encontró un pedido activo.");
      return;
    }

    setLoading(true);

    try {
      // Registrar pago
      const { error: errPago } = await supabase.from("pagos").insert({
        pedido_id: pedidoId,
        monto: calculateTotal(),
        metodo: paymentMethod,
      });
      if (errPago) throw errPago;

      // Actualizar estado del pedido
      const { error: errUpdate } = await supabase
        .from("pedidos")
        .update({ estado: "pagado" })
        .eq("id", pedidoId);
      if (errUpdate) throw errUpdate;

      // Nota: liberar mesa solo lo puede hacer el mesero (RLS)
      localStorage.removeItem("pedido_id");

      alert("Pago confirmado. ¡Gracias por su visita!");
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

  const handleCancel = () => {
    router.push("/clients");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    handleConfirm();
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Finalizar Pedido</h3>

      {clientName && <p>Cliente: {clientName}</p>}
      {tableNumber && <p>Mesa seleccionada: {tableNumber}</p>}

      <ul className="mb-4">
        {cart.map((item, index) => (
          <li key={index}>
            {item.productos?.nombre} x {item.cantidad} = $
            {(item.precio_unitario * item.cantidad).toFixed(2)}
          </li>
        ))}
      </ul>

      <h4 className="font-bold mb-4">Total: ${calculateTotal().toFixed(2)}</h4>

      <label htmlFor="payment">Método de Pago:</label>
      <select
        id="payment"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      >
        <option value="cash">Efectivo</option>
        <option value="card">Tarjeta (Stripe)</option>
        <option value="transfer">Transferencia</option>
      </select>

      <div className="form-actions flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? "Procesando..." : "Confirmar Pago"}
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
