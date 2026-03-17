"use client";

import { useRouter } from "next/navigation";

export default function ClientWelcomeView() {
  const router = useRouter();

  const handleStart = () => {
    // Redirige a la vista de selección de mesa
    router.push("clients/select-table");
  };

  return (
    <div className="app-main text-center">
      <h2>Welcome to Sirve-Té</h2>
      <p>Please press start to select your table and begin your order.</p>
      <button onClick={handleStart}>Start</button>
    </div>
  );
}
