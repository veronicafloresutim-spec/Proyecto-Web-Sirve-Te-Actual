"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CartForm() {
  const router = useRouter();

  // Carrito inicial simulado (puedes reemplazar con datos de Supabase)
  const initialCart: CartItem[] = [
    { id: "1", name: "Té Verde", price: 25, quantity: 2 },
    { id: "2", name: "Café Latte", price: 40, quantity: 1 },
  ];

  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = (cart: CartItem[]) => {
    alert(`Orden confirmada con ${cart.length} productos. Total: $${calculateTotal().toFixed(2)}`);
    // Aquí podrías guardar en Supabase o redirigir
    router.push("/clients");
  };

  const handleCancel = () => {
    router.push("/clients");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    handleCheckout(cart);
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h3>Your Cart</h3>

      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity} = $
              {(item.price * item.quantity).toFixed(2)}
              <div className="cart-actions">
                <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                  +
                </button>
                <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                  -
                </button>
                <button type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h4>Total: ${calculateTotal().toFixed(2)}</h4>

      <div className="form-actions">
        <button type="submit">Confirm Order</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}
