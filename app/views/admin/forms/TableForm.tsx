"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Table = {
  id?: string;
  numero: number;
  estado: string;
};

export default function TableForm() {
  const router = useRouter();

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  //deben aparecer los datos del supabase

  const [formData, setFormData] = useState<Table>({
    numero: 1,
    estado: "libre",
  });

  useEffect(() => {
    fetchTables(); //error
  }, []);
//usar datos de abajo
  const fetchTables = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mesas")
      .select("*")
      .order("numero", { ascending: true });

    if (!error && data) {
      // Mapeo simple para asegurar que los nombres coincidan con tu estado
      setTables(data.map(t => ({
        id: t.id,
        numero: t.numero,
        estado: t.estado
      })));
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "numero" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("mesas")
        .update({
          numero: formData.numero,
          estado: formData.estado
        })
        .eq("id", editingId);
      
      if (!error) setEditingId(null);
    } else {
      await supabase.from("mesas").insert([{
        numero: formData.numero,
        estado: formData.estado
      }]);
    }

    setFormData({ numero: 1, estado: "libre" });
    fetchTables();
  };

  const handleEdit = (table: Table) => {
    setFormData(table);
    setEditingId(table.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta mesa?")) return;
    await supabase.from("mesas").delete().eq("id", id);
    fetchTables();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Mesas</h1>
            <p className="text-gray-500">Configura el número y disponibilidad de las mesas</p>
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
              <h2 className="text-xl font-semibold mb-6">
                {editingId ? "Editar Mesa" : "Nueva Mesa"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Número de Mesa</label>
                  <input
                    type="number"
                    name="numero"
                    min="1"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Estado Inicial</label>
                  <select 
                    name="estado" 
                    value={formData.estado} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  >
                    <option value="libre">Libre (Disponible)</option>
                    <option value="ocupada">Ocupada</option>
                    <option value="sucia">Sucia / Limpieza</option>
                  </select>
                </div>

                <div className="pt-2 space-y-2">
                  <button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-green-100"
                  >
                    {editingId ? "Actualizar Mesa" : "Agregar Mesa"}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {setEditingId(null); setFormData({numero:1, estado:"libre"})}}
                      className="w-full bg-gray-100 text-gray-600 font-medium py-2 rounded-xl"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Lista de Mesas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-xl font-semibold">Salón Actual</h2>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-gray-400 font-medium">Cargando mesas...</div>
              ) : tables.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-medium">No hay mesas configuradas.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                  {tables.map((table) => (
                    <div 
                      key={table.id} 
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-green-500 flex items-center justify-center font-black text-green-600 shadow-sm">
                          {table.numero}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Estado</p>
                          <span className={`text-xs font-black uppercase ${
                            table.estado === 'libre' ? 'text-green-600' : 
                            table.estado === 'ocupada' ? 'text-red-500' : 'text-blue-500'
                          }`}>
                            {table.estado}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(table)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(table.id!)}
                          className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}