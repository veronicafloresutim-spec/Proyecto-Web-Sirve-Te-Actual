"use client";

import { useEffect, useState } from "react";
import { OrderDetail } from "../domain/orderDetail";
import { OrderDetailRepository } from "../infrastructure/orderDetailRepository";
import { GetOrderDetail } from "../application/getOrderDetail";

export default function OrderDetailView({ detailId }: { detailId: string }) {
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const repo = new OrderDetailRepository();
        const getDetail = new GetOrderDetail(repo);
        const result = await getDetail.execute(detailId);
        setDetail(result);
      } catch (err: any) {
        setError(err.message || "Error fetching order detail");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [detailId]);

  if (loading) return <p>Loading order detail...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!detail) return <p>Order detail not found.</p>;

  return (
    <div className="order-detail-card">
      <h3>Order Detail Information</h3>
      <p><strong>ID:</strong> {detail.id}</p>
      <p><strong>Order ID:</strong> {detail.orderId}</p>
      <p><strong>Product ID:</strong> {detail.productId}</p>
      <p><strong>Quantity:</strong> {detail.quantity}</p>
      <p><strong>Price:</strong> ${detail.price.toFixed(2)}</p>
      <p><strong>Subtotal:</strong> ${detail.subtotal.toFixed(2)}</p>
      <p><strong>Created At:</strong> {new Date(detail.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(detail.updatedAt).toLocaleString()}</p>
    </div>
  );
}
