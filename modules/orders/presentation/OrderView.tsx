"use client";

import { useEffect, useState } from "react";
import { Order } from "../domain/order";
import { OrderRepository } from "../infrastructure/orderRepository";
import { GetOrder } from "../application/getOrder";

export default function OrderView({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const repo = new OrderRepository();
        const getOrder = new GetOrder(repo);
        const result = await getOrder.execute(orderId);
        setOrder(result);
      } catch (err: any) {                                         //error
        setError(err.message || "Error fetching order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-card">
      <h3>Order Information</h3>
      <p><strong>ID:</strong> {order.id}</p>
      <p><strong>Table ID:</strong> {order.tableId}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      <p><strong>Products:</strong> {order.products.join(", ")}</p>
      <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
    </div>
  );
}
