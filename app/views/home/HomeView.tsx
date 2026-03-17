"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function HomeView() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Si hay sesión, buscamos el rol en la tabla Usuarios
        const { data: userData } = await supabase
          .from("Usuarios")
          .select("rol")
          .eq("email", session.user.email)
          .single();

        if (userData) {
          setUserRole(userData.rol);
          // Redirección automática si ya está logueado
          if (userData.rol === "admin") router.push("/admin");
          else if (userData.rol === "mesero") router.push("/waiters");
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const goLogin = (role: string) => {
    router.push(`/login?role=${role}`);
  };

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  return (
    <div className="app-main text-center">
      <h1 className="text-3xl font-bold mt-10">Welcome to Sirve-Té</h1>
      <p className="mb-6">Select your role to continue:</p>

      <div className="role-buttons flex justify-center gap-4">
        {/* El cliente siempre es visible */}
        <button 
          className="bg-green-500 text-white p-3 rounded"
          onClick={() => router.push("clients")}
        >
          Cliente
        </button>

        {/* El botón de Mesero SOLO se ve si NO es admin */}
        {userRole !== "admin" && (
          <button 
            className="bg-blue-500 text-white p-3 rounded"
            onClick={() => goLogin("waiter")}
          >
            Mesero
          </button>
        )}

        {/* El botón de Admin siempre es visible (o puedes ocultarlo si ya es mesero) */}
        <button 
          className="bg-red-500 text-white p-3 rounded"
          onClick={() => goLogin("admin")}
        >
          Administrador
        </button>
      </div>
    </div>
  );
}