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

export default function CartForm() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pedidoId = localStorage.getItem("pedido_id");
    if (!pedidoId) {
      alert("No se encontró un pedido activo.");
      router.push("/clients");
      return;
    }

    const loadCart = async () => {
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
      setLoading(false);
    };

    loadCart();
  }, [router]);

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.precio_unitario * item.cantidad, 0);

  const updateQuantity = async (producto_id: string, delta: number) => {
    const pedidoId = localStorage.getItem("pedido_id");
    if (!pedidoId) return;

    const item = cart.find((i) => i.producto_id === producto_id);
    if (!item) return;

    const newQuantity = Math.max(1, item.cantidad + delta);

    const { error } = await supabase
      .from("detalle_pedido")
      .update({ cantidad: newQuantity })
      .eq("pedido_id", pedidoId)
      .eq("producto_id", producto_id);

    if (error) {
      console.error("Error actualizando cantidad:", error);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((i) =>
        i.producto_id === producto_id ? { ...i, cantidad: newQuantity } : i
      )
    );
  };

  const removeItem = async (producto_id: string) => {
    const pedidoId = localStorage.getItem("pedido_id");
    if (!pedidoId) return;

    const { error } = await supabase
      .from("detalle_pedido")
      .delete()
      .eq("pedido_id", pedidoId)
      .eq("producto_id", producto_id);

    if (error) {
      console.error("Error eliminando producto:", error);
      return;
    }

    setCart((prevCart) => prevCart.filter((i) => i.producto_id !== producto_id));
  };

  const handleCheckout = async () => {
    alert(
      `Orden confirmada con ${cart.length} productos. Total: $${calculateTotal().toFixed(2)}`
    );
    router.push("/checkout"); // redirige al formulario de pago
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
    handleCheckout();
  };

  if (loading) {
    return <p className="text-center">Cargando carrito...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="crud-form p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Tu Carrito</h3>

      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <ul className="mb-4">
          {cart.map((item) => (
            <li key={item.producto_id} className="mb-2">
              {item.productos?.nombre} - ${item.precio_unitario.toFixed(2)} x{" "}
              {item.cantidad} = $
              {(item.precio_unitario * item.cantidad).toFixed(2)}
              <div className="cart-actions flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.producto_id, 1)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.producto_id, -1)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.producto_id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h4 className="font-bold mb-4">Total: ${calculateTotal().toFixed(2)}</h4>

      <div className="form-actions flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Confirmar Pedido
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded"
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
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Inicio
        </button>
      </div>
    </form>
  );
}
