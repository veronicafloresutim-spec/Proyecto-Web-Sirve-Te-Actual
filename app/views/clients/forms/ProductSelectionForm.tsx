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
  imagen_url?: string; // ✅ asumimos que tu tabla tiene esta columna
};

export default function ProductSelectionForm() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("categoria");

      if (error) {
        console.error("Error cargando productos:", error);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert("Por favor selecciona un producto.");
      return;
    }

    // Aquí podrías guardar en Supabase o en tu flujo de carrito
    alert(`Agregado al carrito: ${selectedProduct.nombre} x${quantity}`);

    // Redirigir después de agregar
    router.push("/clients/order");
  };

  const handleCancel = () => {
    router.push("/clients");
  };

  if (loading) {
    return <p className="text-center">Cargando productos...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="crud-form p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Selecciona un Producto</h3>

      <label htmlFor="product">Producto:</label>
      <select
        id="product"
        value={selectedProduct?.id || ""}
        onChange={(e) => {
          const product = products.find((p) => p.id === e.target.value) || null;
          setSelectedProduct(product);
        }}
        className="border rounded p-2 w-full mb-4"
      >
        <option value="">-- Elige un producto --</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.nombre} (${product.precio.toFixed(2)})
          </option>
        ))}
      </select>

      {selectedProduct && (
        <>
          {/* ✅ Mostrar imagen del producto */}
          {selectedProduct.imagen_url && (
            <img
              src={selectedProduct.imagen_url}
              alt={selectedProduct.nombre}
              className="w-full h-48 object-cover rounded mb-4"
            />
          )}

          <p className="mb-2">{selectedProduct.descripcion}</p>
          <label htmlFor="quantity">Cantidad:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border rounded p-2 w-full mb-4"
          />
        </>
      )}

      <div className="form-actions flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Agregar al Carrito
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
