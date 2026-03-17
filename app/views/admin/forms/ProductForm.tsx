"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url?: string;
};

export default function ProductForm() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Product>({
    nombre: "",
    descripcion: "",
    precio: 0,
    categoria: "comida",
    imagen_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("nombre", { ascending: true });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "precio" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("productos")
        .update(formData)
        .eq("id", editingId);
      if (!error) setEditingId(null);
    } else {
      await supabase.from("productos").insert([formData]);
    }

    setFormData({ nombre: "", descripcion: "", precio: 0, categoria: "comida", imagen_url: "" });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await supabase.from("productos").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Menú</h1>
            <p className="text-gray-500">Añade o edita los productos de tu restaurante</p>
          </div>
          <button 
            onClick={() => router.push("/admin")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
          >
            Regresar
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Producto */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Producto</label>
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition"
                    placeholder="Ej. Hamburguesa Doble"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select 
                    name="categoria" 
                    value={formData.categoria} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="comida">Comida</option>
                    <option value="bebida">Bebida</option>
                    <option value="postre">Postre</option>
                    <option value="entrada">Entrada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Precio ($)</label>
                  <input
                    type="number"
                    name="precio"
                    step="0.01"
                    value={formData.precio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:orange-500 outline-none"
                    placeholder="Ingredientes o detalles..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">URL de Imagen (Opcional)</label>
                  <input
                    name="imagen_url"
                    value={formData.imagen_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="https://link-de-la-imagen.jpg"
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <button 
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-orange-100"
                  >
                    {editingId ? "Actualizar Producto" : "Agregar al Menú"}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {setEditingId(null); setFormData({nombre:"", descripcion:"", precio:0, categoria:"comida", imagen_url:""})}}
                      className="w-full bg-gray-100 text-gray-600 font-medium py-2 rounded-xl"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Productos Existentes</h2>
                <span className="text-sm font-bold text-orange-500">{products.length} Items</span>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-gray-400 font-medium">Cargando menú...</div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-medium">No hay productos registrados.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <tr>
                        <th className="px-6 py-4 text-left">Producto</th>
                        <th className="px-6 py-4 text-left">Categoría</th>
                        <th className="px-6 py-4 text-left">Precio</th>
                        <th className="px-6 py-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {p.imagen_url && (
                                <img src={p.imagen_url} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover" />
                              )}
                              <div>
                                <p className="font-bold text-gray-800">{p.nombre}</p>
                                <p className="text-xs text-gray-400 line-clamp-1">{p.descripcion}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase">
                              {p.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-700">
                            ${p.precio.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 font-bold text-sm">Editar</button>
                            <button onClick={() => handleDelete(p.id!)} className="text-red-500 hover:text-red-700 font-bold text-sm">Borrar</button>
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