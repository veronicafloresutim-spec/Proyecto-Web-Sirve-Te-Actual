"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
};

export default function OrderView() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [products,setProducts] = useState<Product[]>([]);
  const [loading,setLoading] = useState(true);
  const [tableId, setTableId] = useState<string | null>(null);

  const [cart,setCart] = useState<
    { id:string; name:string; price:number; quantity:number }[]
  >([]);

  //no deben de estar

  // Cargar productos desde Supabase
  useEffect(()=>{
      
    const savedTableId = localStorage.getItem("mesa_id");

    const loadProducts = async ()=>{

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("categoria");

      if(error){
        console.error(error);
        return;
      }

      //debe jalar los datos de abajo

      setProducts(data || []);
      setLoading(false);
      setTableId(savedTableId);

    };

    loadProducts();

  },[]);

  const addToCart = (product: Product) => {

    setCart((prevCart)=>{

      const existing = prevCart.find(
        (item)=>item.id === product.id
      );

      if(existing){
        return prevCart.map((item)=>
          item.id === product.id
            ? { ...item, quantity:item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.nombre,
          price: product.precio,
          quantity: 1
        }
      ];

    });

  };

  const total = cart.reduce(
    (sum,item)=> sum + item.price * item.quantity,
    0
  );
const handleCheckout = async () => {

if (!tableId || tableId === "null") {
    alert("Error: No se ha detectado la mesa.");
    return;
  }

  try {

    const { data: { user } } = await supabase.auth.getUser();

    const { data: pedidoData, error: pedidoError } = await supabase
      .from("pedidos")
      .insert([{
        mesa_id: tableId,
        cliente_id: user?.id || null,
        estado: "pendiente"
      }])
      .select()
      .single();

    if (pedidoError) throw pedidoError;

    if (!pedidoData) {
      throw new Error("No se pudo crear el pedido");
    }

    const detalles = cart.map((item) => ({
      pedido_id: pedidoData.id,
      cantidad: item.quantity,
      precio_unitario: item.price,
      producto_id: item.id,
    }));

    const { error: detallesError } = await supabase
      .from("detalle_pedido")
      .insert(detalles);

    if (detallesError) throw detallesError;

    localStorage.setItem("pedido_id", pedidoData.id);

    setCart([]); // limpiar carrito

    router.push("/clients/payment");

  } catch (error: any) {                                 //error

    console.error("Error al guardar pedido:", error);
    alert("Error al guardar el pedido.");

  }

};
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );


  return (

    <div className="app-main">

      <h2>Menú del Restaurante</h2>

      {tableId && <p>Mesa seleccionada: {tableId}</p>}

      <div className="products-list">

        {products.map((product)=> (

          <div key={product.id} className="product-card">

            <h3>{product.nombre}</h3>

            <p>{product.descripcion}</p>

            <p>
              <strong>${product.precio.toFixed(2)}</strong>
            </p>

            <button
              onClick={()=>addToCart(product)}
            >
              Agregar
            </button>

          </div>

        ))}

      </div>

      <div className="cart-summary">

        <h3>Carrito</h3>

        {cart.length === 0 ? (
          <p>No hay productos.</p>
        ) : (

          <ul>

            {cart.map((item)=>(
              <li key={item.id}>
                {item.name} x {item.quantity}
                = ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}

          </ul>

        )}

        <p>
          <strong>Total: ${total.toFixed(2)}</strong>
        </p>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
        >
          Ir al carrito
        </button>

      </div>

    </div>

  );
}