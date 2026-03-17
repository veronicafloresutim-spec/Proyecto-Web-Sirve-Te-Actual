"use client"

import { useState } from "react"
import { supabase } from "../../../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // 1. Registro en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Si el usuario se creó correctamente en Auth, lo guardamos en nuestra tabla 'usuarios'
    if (authData.user) {
      const { error: dbError } = await supabase
        .from("Usuarios")
        .insert([
          {
            id: authData.user.id, // Vinculamos con el ID de Auth
            nombre: name,
            email: email,
            password: password,
            rol: "Mesero" // Por defecto se registra como cliente
          }
        ])

      if (dbError) {
        setError("Error al guardar en la base de datos: " + dbError.message)
        setLoading(false)
        return
      }
    }

    setSuccess("Cuenta creada. Por favor, revisa tu correo para confirmar (si está activado) o inicia sesión.")
    setLoading(false)

    setTimeout(() => {
      router.push("/login")
    }, 3000)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-10 rounded shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm border border-green-200">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre Completo</label>
          <input
            type="text"
            placeholder="Juan Pérez"
            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white p-2 rounded font-bold transition-colors`}
        >
          {loading ? "Procesando..." : "Registrarse"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?
          <Link href="/login" className="text-blue-600 ml-2 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  )
}