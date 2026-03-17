"use client"
import { useState } from "react"
import { supabase } from "../../../lib/supabaseClient" // Asegúrate que este sea el cliente de supabase
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // 1. Iniciar sesión en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      setError("Credenciales incorrectas")
      setLoading(false)
      return
    }

    // 2. Buscar el usuario en tu tabla personalizada 'usuarios' por el email
    const { data: userData, error: dbError } = await supabase
      .from("Usuarios")
      .select("rol")
      .eq("email", email)
      .single()

    if (dbError || !userData) {
      // Si no existe en la tabla de usuarios, cerramos la sesión por seguridad
      await supabase.auth.signOut()
      setError("Usuario no registrado en el sistema de gestión.")
      setLoading(false)
      return
    }

    // 3. Lógica de redirección basada en el rol
    const rol = userData.rol;

    if (rol === "admin") {
      router.push("/admin")
    } else if (rol === "Mesero") {
      router.push("/waiter")
    } else {
      // Si es un cliente, podrías redirigirlo al inicio o mostrar un error
      // si tu política es que los clientes no entren por este login.
      router.push("/")
    }

    router.refresh() // Refresca el layout para que el Sidebar aparezca/desaparezca
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded shadow-lg w-96 border border-gray-200"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🍽 Iniciar sesión
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2 rounded transition-colors`}
        >
          {loading ? "Cargando..." : "Entrar al sistema"}
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          ¿No tienes cuenta?
          <Link href="/login/register" className="text-blue-600 ml-2 font-semibold hover:underline">
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  )
}