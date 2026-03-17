import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
// import { supabase } from "../lib/supabaseClient"; // Tu configuración de Supabase

export const metadata: Metadata = {
  title: "Sirve-Te | Sistema de Restaurante",
  description: "Sistema de gestión de restaurante",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 1. Obtenemos el usuario que acaba de hacer login
 // const { data: { user } } = await supabase.auth.getUser();

  // 2. Si hay usuario, buscamos su rol en nuestra tabla 'usuarios' por su correo
  // let userRole = "cliente"; // Rol por defecto

  // if (user?.email) {
  //   const { data: userData } = await supabase
  //     .from("usuarios")
  //     .select("rol")
  //     .eq("email", user.email)
  //     .single();
    
  //   if (userData) {
  //     userRole = userData.rol; // Ejemplo: 'admin', 'mesero' o 'cliente'
  //   }
  // }

  // 3. Definimos permisos
  // const esAdmin = userRole === "admin";
  // const esMesero = userRole === "Mesero";
  // const mostrarSidebar = esAdmin || esMesero;

  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen">
          
          {/* Sidebar: Solo se renderiza si es Admin o Mesero */}
            <aside className="w-64 bg-gray-900 text-white p-5">
              <h1 className="text-2xl font-bold mb-8">🍽 Sirve-Te</h1>
              
          
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 p-10 bg-gray-100">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}

  // { mostrarSidebar && (
  //             <nav className="flex flex-col gap-4">
  //               <Link href="/" className="hover:bg-gray-700 p-2 rounded">
  //                 Inicio
  //               </Link>
                
  //               <Link href="/products" className="hover:bg-gray-700 p-2 rounded">
  //                 Productos
  //               </Link>

  //               <Link href="/tables" className="hover:bg-gray-700 p-2 rounded">
  //                 Mesas
  //               </Link>

  //               <Link href="/orders" className="hover:bg-gray-700 p-2 rounded">
  //                 Órdenes
  //               </Link>

  //               {/* Administración: SOLO si es Admin (el mesero no lo ve) */}
  //               {esAdmin && (
  //                 <Link 
  //                   href="/admin" 
  //                   className="mt-4 p-2 bg-red-900 hover:bg-red-800 rounded text-center font-bold"
  //                 >
  //                   Panel Administración
  //                 </Link>
  //               )}
  //             </nav>
  //         )}