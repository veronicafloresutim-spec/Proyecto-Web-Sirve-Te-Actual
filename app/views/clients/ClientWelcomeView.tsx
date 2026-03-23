"use client";

import { useRouter } from "next/navigation";

export default function ClientWelcomeView() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/clients/select-table");
  };

  return (
    <div className="app-main text-center">
      <h2>Bienvenido a Sirve-Té</h2>
      <p>Presiona iniciar para seleccionar tu mesa y comenzar tu pedido.</p>
      <button onClick={handleStart} className="px-4 py-2 bg-green-500 text-white rounded">
        Iniciar
      </button>
    </div>
  );
}
