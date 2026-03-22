"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type User = {
  id?: string;
  nombre: string;
  rol: string;
  email: string;
  password?: string;
};

export default function UserForm() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<User>({
    nombre: "",
    rol: "client",
    email: "",
    password: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers(); //error
  }, []);
//usar funciones de abajo
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Usuarios")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) console.error("Error:", error.message);
    else setUsers(data || []);
    setLoading(false);
  };
//usarlas modules
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase
        .from("Usuarios")
        .update({
          nombre: formData.nombre,
          role: formData.rol,
          email: formData.email,
        })
        .eq("id", editingId);
      if (error) alert("Error al actualizar");
      setEditingId(null);
    } else {
      const { error } = await supabase.from("Usuarios").insert([formData]);
      if (error) alert("Error al guardar");
    }
    setFormData({ nombre: "", rol: "client", email: "", password: "" });
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setEditingId(user.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    const { error } = await supabase.from("Usuarios").delete().eq("id", id);
    if (error) alert("Error al eliminar");
    else fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Usuarios</h1>
            <p className="text-gray-500">Administra los accesos y roles del sistema</p>
          </div>
          <button 
            onClick={() => router.push("/admin")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
          >
            Regresar
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-700">
                {editingId ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    name="name"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select 
                    name="role" 
                    value={formData.rol} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  >
                    <option value="client">Cliente</option>
                    <option value="waiter">Mesero</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder={editingId ? "Dejar en blanco para no cambiar" : "••••••••"}
                    required={!editingId}
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-100"
                  >
                    {editingId ? "Guardar Cambios" : "Crear Usuario"}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {setEditingId(null); setFormData({nombre:"", rol:"", email:"", password:""})}}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 rounded-xl transition"
                    >
                      Cancelar Edición
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Lista de Usuarios */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-1xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-xl font-semibold text-gray-700">Usuarios Registrados</h2>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-gray-400">Cargando usuarios...</div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No hay usuarios registrados todavía.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xl font-bold text-gray-500 uppercase">Nombre</th>
                        <th className="px-6 py-4 text-left text-xl font-bold text-gray-500 uppercase">Rol</th>
                        <th className="px-6 py-4 text-left text-xl font-bold text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-4 text-center text-xl font-bold text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{user.nombre}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs">
                            <span className={`px-3 py-1 rounded-full font-semibold text-[11px] uppercase ${
                              user.rol === 'admin' ? 'bg-purple-100 text-purple-700' :
                              user.rol === 'waiter' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {user.rol}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                            <button 
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-800 font-bold text-sm px-2 py-1"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDelete(user.id!)}
                              className="text-red-500 hover:text-red-700 font-bold text-sm px-2 py-1"
                            >
                              Borrar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}