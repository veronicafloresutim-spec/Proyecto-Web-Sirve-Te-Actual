"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutForm() {
  const router = useRouter();

  // Carrito simulado (puedes reemplazar con datos de Supabase)
  const cart: CartItem[] = [
    { id: "1", name: "Té Verde", price: 25, quantity: 2 },
    { id: "2", name: "Café Latte", price: 40, quantity: 1 },
  ];

  // Mesa seleccionada (puedes obtenerla dinámicamente)
  const tableId: string | null = "Mesa 5";

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirm = () => {
    alert(
      `Payment confirmed for Table ${tableId} with ${paymentMethod}. Total: $${calculateTotal().toFixed(2)}`
    );
    // Aquí podrías insertar en Supabase (pedidos, detallePedido, ventas)
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
    handleConfirm();
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h3>Checkout</h3>
      {tableId && <p>Selected Table: {tableId}</p>}

      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>

      <h4>Total: ${calculateTotal().toFixed(2)}</h4>

      <label htmlFor="payment">Payment Method:</label>
      <select
        id="payment"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="transfer">Transfer</option>
      </select>

      <div className="form-actions">
        <button type="submit">Confirm Payment</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}
