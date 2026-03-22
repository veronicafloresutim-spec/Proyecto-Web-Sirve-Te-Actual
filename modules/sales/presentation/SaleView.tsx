"use client";

import { useEffect, useState } from "react";
import { Sale } from "../domain/sale";
import { SaleRepository } from "../infrastructure/saleRepository";
import { GetSale } from "../application/getSale";

export default function SaleView({ saleId }: { saleId: string }) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const repo = new SaleRepository();
        const getSale = new GetSale(repo);
        const result = await getSale.execute(saleId);
        setSale(result);
      } catch (err: any) {                                   //error
        setError(err.message || "Error fetching sale");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [saleId]);

  if (loading) return <p>Loading sale...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!sale) return <p>Sale not found.</p>;

  return (
    <div className="sale-card">
      <h3>Sale Information</h3>
      <p><strong>ID:</strong> {sale.id}</p>
      <p><strong>Order ID:</strong> {sale.orderId}</p>
      <p><strong>Total:</strong> ${sale.total.toFixed(2)}</p>
      <p><strong>Payment Method:</strong> {sale.paymentMethod}</p>
      <p><strong>Status:</strong> {sale.status}</p>
      <p><strong>Created At:</strong> {new Date(sale.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(sale.updatedAt).toLocaleString()}</p>
    </div>
  );
}
