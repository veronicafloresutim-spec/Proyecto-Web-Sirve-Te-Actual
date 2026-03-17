"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type DetallePedido = {
  id?: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
  // Campos extra para mostrar nombres en la lista
  nombre_producto?: string;
};

export default function DetallePedidoForm() {
  const router = useRouter();

  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<DetallePedido>({
    pedido_id: "",
    producto_id: "",
    cantidad: 1,
    precio_unitario: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    // 1. Cargar Productos para el Select
    const { data: prodData } = await supabase.from("productos").select("*");
    setProductos(prodData || []);

    // 2. Cargar Detalles con Join para ver el nombre del producto
    const { data: detData, error } = await supabase
      .from("detalle_pedido")
      .select(`*`);

    if (!error && detData) {
      const formatted = detData.map((d: any) => ({
        ...d,
        nombre_producto: d.productos?.nombre || "Producto eliminado",
        subtotal: d.cantidad * d.precio_unitario
      }));
      setDetalles(formatted);
    }
    setLoading(false);
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prodId = e.target.value;
    const productoSeleccionado = productos.find((p) => p.id === prodId);
    
    setFormData({
      ...formData,
      producto_id: prodId,
      precio_unitario: productoSeleccionado ? productoSeleccionado.precio : 0
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // El subtotal se calcula en la base de datos o aquí
    const dataToSave = {
      pedido_id: formData.pedido_id,
      producto_id: formData.producto_id,
      cantidad: formData.cantidad,
      precio_unitario: formData.precio_unitario
    };

    if (editingId) {
      await supabase.from("detalle_pedido").update(dataToSave).eq("id", editingId);
      setEditingId(null);
    } else {
      await supabase.from("detalle_pedido").insert([dataToSave]);
    }

    setFormData({ pedido_id: "", producto_id: "", cantidad: 1, precio_unitario: 0 });
    fetchInitialData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Quitar este producto del pedido?")) return;
    await supabase.from("detalle_pedido").delete().eq("id", id);
    fetchInitialData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-indigo-900 uppercase tracking-tighter">Detalle de Comandas</h1>
            <p className="text-indigo-600 font-bold text-sm">Contenido de los pedidos en curso</p>
          </div>
          <button onClick={() => router.push("/admin")} className="text-gray-400 font-bold hover:text-indigo-600 transition">Cerrar</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Inserción */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl border-b-4 border-indigo-500">
              <h2 className="text-lg font-black mb-6 uppercase text-gray-700">Agregar Producto a Orden</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase">ID del Pedido (Vincular)</label>
                  <input
                    name="pedido_id"
                    placeholder="UUID del pedido"
                    value={formData.pedido_id}
                    onChange={(e) => setFormData({...formData, pedido_id: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase">Seleccionar Producto</label>
                  <select
                    name="producto_id"
                    value={formData.producto_id}
                    onChange={handleProductChange}
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  >
                    <option value="">Elegir del menú...</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase">Cantidad</label>
                    <input
                      type="number"
                      name="cantidad"
                      min="1"
                      value={formData.cantidad}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase">Precio Unit.</label>
                    <input
                      type="number"
                      name="precio_unitario"
                      value={formData.precio_unitario}
                      className="w-full px-4 py-2 bg-gray-200 border-none rounded-xl outline-none text-gray-500 cursor-not-allowed font-bold"
                      readOnly
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-indigo-100 uppercase text-xs tracking-widest"
                >
                  {editingId ? "Actualizar Item" : "Añadir a la Orden"}
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Detalles */}
          <div className="lg:col-span-2">
            <div className="bg-indigo-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-indigo-800">
                <h2 className="text-white font-black uppercase text-sm tracking-widest italic">Items en preparación / servidos</h2>
              </div>

              {loading ? (
                <div className="p-20 text-center text-indigo-300 font-bold animate-pulse">Consultando cocina...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-indigo-950 text-[10px] font-black text-indigo-400 uppercase">
                      <tr>
                        <th className="px-6 py-4">Orden</th>
                        <th className="px-6 py-4">Producto</th>
                        <th className="px-6 py-4 text-center">Cant.</th>
                        <th className="px-6 py-4 text-right">Subtotal</th>
                        <th className="px-6 py-4 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="text-indigo-100 divide-y divide-indigo-800">
                      {detalles.map((d) => (
                        <tr key={d.id} className="hover:bg-indigo-800/50 transition-colors">
                          <td className="px-6 py-4 text-[10px] font-mono opacity-60">#{d.pedido_id.slice(0,8)}...</td>
                          <td className="px-6 py-4 font-bold">{d.nombre_producto}</td>
                          <td className="px-6 py-4 text-center font-black bg-indigo-800/30 text-indigo-400">{d.cantidad}</td>
                          <td className="px-6 py-4 text-right font-black text-white">${d.subtotal?.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleDelete(d.id!)}
                              className="text-pink-500 hover:text-pink-300 font-black text-[10px] uppercase tracking-tighter transition"
                            >
                              Eliminar
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