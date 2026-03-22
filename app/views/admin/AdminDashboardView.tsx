"use client";

import { useState } from "react";
import UserForm from "./forms/UserForm";
import ProductForm from "./forms/ProductForm";
import TableForm from "./forms/TableForm";
import OrderForm from "./forms/OrderForm";

export default function AdminDashboardView() {
  const [section, setSection] = useState<
    "users" | "products" | "tables" | "orders" | null
  >(null);

  return (
    <div className="app-main text-center">
      <h2>Administrator Dashboard</h2>
      <p>Select a section to manage:</p>

      <div className="dashboard-actions">
        <button onClick={() => setSection("users")}>Manage Users</button>
        <button onClick={() => setSection("products")}>Manage Products</button>
        <button onClick={() => setSection("tables")}>Manage Tables</button>
        <button onClick={() => setSection("orders")}>Manage Orders</button>
      </div>

      <div className="dashboard-section">
        {section === "users" && (
          <UserForm onCancel={() => setSection(null)} /> // error
        )}
        {section === "products" && (
          <ProductForm onCancel={() => setSection(null)} /> // error
        )}
        {section === "tables" && (
          <TableForm onCancel={() => setSection(null)} /> //error
        )}
        {section === "orders" && (
          <OrderForm onCancel={() => setSection(null)} /> //error
        )}
      </div>
    </div>
  );
}
