"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Product = { id: string; nombre: string; precio: number };
type OrderDetail = { producto_id: string; nombre: string; cantidad: number; precio_unitario: number; subtotal: number };

export default function MasterOrderForm() {
  const router = useRouter();
  
  // Estados para datos de Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);         // da error
  const [loading, setLoading] = useState(true);

  // Estados del Formulario (Cabecera)
  const [clientName, setClientName] = useState("");
  const [tableNumber, setTableNumber] = useState(1);
  
  // Estado de la "Carrito" (Detalle temporal antes de guardar)
  const [cart, setCart] = useState<OrderDetail[]>([]);

  useEffect(() => {
    fetchInitialData(); // da error
  }, []);

  //quitar esto
  const fetchInitialData = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from("productos").select("id, nombre, precio");
    const { data: oData } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5);
    setProducts(pData || []);
    setOrders(oData || []);
    setLoading(false);
  };
//tomar las funciones de abajo

  const addToCart = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const existing = cart.find(item => item.producto_id === productId);
    if (existing) {
      setCart(cart.map(item => 
        item.producto_id === productId 
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio_unitario }
          : item
      ));
    } else {
      setCart([...cart, { 
        producto_id: prod.id, 
        nombre: prod.nombre, 
        cantidad: 1, 
        precio_unitario: prod.precio, 
        subtotal: prod.precio 
      }]);
    }
  };

  const calculateTotal = () => cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("El carrito está vacío");

    const total = calculateTotal();

    // 1. Insertar en la tabla 'orders'
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([{ client_name: clientName, table_number: tableNumber, status: "pending", total }])
      .select()
      .single();

    if (orderError) return alert("Error al crear pedido");

    // 2. Insertar todos los items en 'detalle_pedido' vinculados al ID anterior
    const detailsToInsert = cart.map(item => ({
      pedido_id: orderData.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario
    }));

    const { error: detailError } = await supabase.from("detalle_pedido").insert(detailsToInsert);

    if (!detailError) {
      alert("¡Pedido enviado a cocina!");
      setCart([]);
      setClientName("");
      setTableNumber(1);
      fetchInitialData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: MENÚ DE PRODUCTOS */}
        <div className="lg:col-span-7 space-y-6">
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tighter uppercase text-blue-400">Nueva Comanda</h1>
            <button onClick={() => router.push("/admin")} className="text-slate-500 hover:text-white text-xs font-bold uppercase">Cerrar POS</button>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p.id)}
                className="bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-700 transition-all text-left group"
              >
                <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{p.nombre}</p>
                <p className="text-sm font-black text-slate-500 group-hover:text-slate-300 mt-1">${p.precio}</p>
              </button>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN Y PAGO */}
        <div className="lg:col-span-5">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl p-6 h-full flex flex-col border-t-[10px] border-blue-600">
            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              🛒 Resumen de Orden
            </h2>

            {/* Inputs de Cabecera */}
            <div className="space-y-4 mb-6">
              <input 
                placeholder="Nombre del Cliente" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-4">
                <label className="text-xs font-black uppercase text-slate-400">Mesa:</label>
                <input 
                  type="number" 
                  value={tableNumber}
                  onChange={(e) => setTableNumber(Number(e.target.value))}
                  className="w-20 bg-slate-100 border-none rounded-xl py-2 px-3 font-black text-center"
                />
              </div>
            </div>

            {/* Lista del Carrito (Detalle) */}
            <div className="flex-grow overflow-y-auto space-y-3 mb-6 min-h-[200px]">
              {cart.length === 0 ? (
                <p className="text-center text-slate-300 py-10 font-bold uppercase italic text-sm">Selecciona productos del menú</p>
              ) : (
                cart.map((item) => (
                  <div key={item.producto_id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <div>
                      <p className="font-bold text-sm">{item.nombre}</p>
                      <p className="text-[10px] font-bold text-slate-400">{item.cantidad} x ${item.precio_unitario}</p>
                    </div>
                    <p className="font-black text-blue-600">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            {/* Total y Botón de Envío */}
            <div className="border-t-2 border-dashed border-slate-200 pt-6">
              <div className="flex justify-between items-end mb-6">
                <span className="text-xs font-black uppercase text-slate-400">Total a pagar</span>
                <span className="text-4xl font-black text-slate-900">${calculateTotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={handleSubmitOrder}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all uppercase tracking-widest text-sm active:scale-95"
              >
                🚀 Enviar Pedido a Cocina
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}