"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function OrderView() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableId, setTableId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedTableId = localStorage.getItem("mesa_id");

    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("categoria");

      if (error) {
        console.error(error);
        return;
      }

      setProducts(data || []);
      setLoading(false);
      setTableId(savedTableId);
    };

    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.nombre,
          price: product.precio,
          quantity: 1,
        },
      ];
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!tableId || tableId === "null") {
      alert("Error: No se ha detectado la mesa.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedidos")
        .insert([
          {
            mesa_id: tableId,
            cliente_id: user?.id || null,
            estado: "pendiente",
          },
        ])
        .select()
        .single();

      if (pedidoError) throw pedidoError;
      if (!pedidoData) throw new Error("No se pudo crear el pedido");

      const detalles = cart.map((item) => ({
        pedido_id: pedidoData.id,
        cantidad: item.quantity,
        precio_unitario: item.price,
        producto_id: item.id,
      }));

      const { error: detallesError } = await supabase
        .from("detalle_pedido")
        .insert(detalles);

      if (detallesError) throw detallesError;

      localStorage.setItem("pedido_id", pedidoData.id);
      setCart([]);

      router.push("/clients/payment");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error al guardar pedido:", error.message);
        alert("Error al guardar el pedido: " + error.message);
      } else {
        console.error("Error desconocido:", error);
        alert("Error inesperado al guardar el pedido.");
      }
    }
  };

  const handleEditOrder = () => {
    alert("Funcionalidad de edición de pedido en construcción.");
  };

  const handleCancelOrder = () => {
    setCart([]);
    alert("Pedido cancelado.");
    router.push("/clients/select-table");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );

  return (
    <div className="app-main p-6">
      <h2 className="text-2xl font-bold mb-4">Menú del Restaurante</h2>

      {tableId && <p className="mb-4">Mesa seleccionada: {tableId}</p>}

      <div className="products-list grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {products.map((product) => (
          <div key={product.id} className="product-card p-4 border rounded shadow">
            <h3 className="font-bold">{product.nombre}</h3>
            <p>{product.descripcion}</p>
            <p>
              <strong>${product.precio.toFixed(2)}</strong>
            </p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
            >
              Agregar
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary border-t pt-4">
        <h3 className="text-xl font-bold mb-2">Carrito</h3>

        {cart.length === 0 ? (
          <p>No hay productos.</p>
        ) : (
          <ul className="mb-2">
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} = $
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        )}

        <p className="mb-4">
          <strong>Total: ${total.toFixed(2)}</strong>
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Confirmar Pedido
          </button>
          <button
            onClick={handleEditOrder}
            disabled={cart.length === 0}
            className="px-4 py-2 bg-yellow-500 text-white rounded disabled:bg-gray-300"
          >
            Editar Pedido
          </button>
          <button
            onClick={handleCancelOrder}
            disabled={cart.length === 0}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            Cancelar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
