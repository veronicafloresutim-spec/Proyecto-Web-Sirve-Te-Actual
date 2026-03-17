"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

export default function ProductSelectionForm() {
  const router = useRouter();

  // Lista de productos (puedes reemplazar con datos de Supabase)
  const products: Product[] = [
    { id: "1", name: "Té Verde", description: "Refrescante y saludable", price: 25, category: "tea" },
    { id: "2", name: "Café Latte", description: "Suave y cremoso", price: 40, category: "coffee" },
    { id: "3", name: "Jugo de Naranja", description: "Natural y fresco", price: 30, category: "juice" },
  ];

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    // Aquí podrías guardar en Supabase o en tu flujo de carrito
    alert(`Agregado al carrito: ${selectedProduct.name} x${quantity}`);

    // Redirigir después de agregar
    router.push("/clients");
  };

  const handleCancel = () => {
    // Redirigir al cancelar
    router.push("/clients");
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h3>Select a Product</h3>

      <label htmlFor="product">Product:</label>
      <select
        id="product"
        value={selectedProduct?.id || ""}
        onChange={(e) => {
          const product = products.find((p) => p.id === e.target.value) || null;
          setSelectedProduct(product);
        }}
      >
        <option value="">-- Choose a product --</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} (${product.price.toFixed(2)})
          </option>
        ))}
      </select>

      {selectedProduct && (
        <>
          <p>{selectedProduct.description}</p>
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </>
      )}

      <div className="form-actions">
        <button type="submit">Add to Cart</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}
