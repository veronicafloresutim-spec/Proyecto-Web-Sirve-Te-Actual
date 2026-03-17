"use client";

import { useState, useEffect } from "react";

type Sale = {
  id: string;
  orderId: string;
  tableNumber: number;
  amount: number;
  paymentMethod: string;
  date: string;
};

export default function SalesView() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    // TODO: Integrar con Supabase para obtener ventas reales
    const demoSales: Sale[] = [
      {
        id: "1",
        orderId: "101",
        tableNumber: 3,
        amount: 25.5,
        paymentMethod: "cash",
        date: "2026-03-10",
      },
      {
        id: "2",
        orderId: "102",
        tableNumber: 1,
        amount: 40.0,
        paymentMethod: "card",
        date: "2026-03-11",
      },
      {
        id: "3",
        orderId: "103",
        tableNumber: 2,
        amount: 18.75,
        paymentMethod: "transfer",
        date: "2026-03-12",
      },
    ];
    setSales(demoSales);
  }, []);

  return (
    <div className="app-main text-center">
      <h2>Sales History</h2>
      {sales.length === 0 ? (
        <p>No sales recorded.</p>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Order ID</th>
              <th>Table</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{sale.orderId}</td>
                <td>{sale.tableNumber}</td>
                <td>${sale.amount.toFixed(2)}</td>
                <td>{sale.paymentMethod}</td>
                <td>{sale.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
