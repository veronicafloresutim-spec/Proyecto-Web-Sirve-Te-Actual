"use client";

import { useEffect, useState } from "react";
import { Table } from "../domain/table";
import { TableRepository } from "../infrastructure/tableRepository";
import { GetTable } from "../application/getTable";

export default function TableView({ tableId }: { tableId: string }) {
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const repo = new TableRepository();
        const getTable = new GetTable(repo);
        const result = await getTable.execute(tableId);
        setTable(result);
      } catch (err: any) {                                              //error
        setError(err.message || "Error fetching table");
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [tableId]);

  if (loading) return <p>Loading table...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!table) return <p>Table not found.</p>;

  return (
    <div className="table-card">
      <h3>Table Information</h3>
      <p><strong>ID:</strong> {table.id}</p>
      <p><strong>Number:</strong> {table.number}</p>
      <p><strong>Capacity:</strong> {table.capacity} people</p>
      <p><strong>Status:</strong> {table.status}</p>
      <p><strong>Created At:</strong> {new Date(table.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(table.updatedAt).toLocaleString()}</p>
    </div>
  );
}
