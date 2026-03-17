"use client";

import { useParams } from "next/navigation";

export default function SaleDetailPage() {
  const params = useParams();
  const { id } = params; // aquí obtienes el valor dinámico de la URL

  return (
    <div className="sale-detail">
      <h1>Sale Detail</h1>
      <p>Showing sale with ID: {id}</p>
    </div>
  );
}
