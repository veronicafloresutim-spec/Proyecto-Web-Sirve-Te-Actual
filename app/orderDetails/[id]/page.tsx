"use client";

import { useEffect,useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Product = {
  id:string
  nombre:string
  precio:number
};

export default function WaiterOrder(){

  const [products,setProducts] = useState<Product[]>([]);
  const [cart,setCart] = useState<any[]>([]);// error
  const router = useRouter();

  useEffect(()=>{
    loadProducts();//error
  },[]);
// esto debe de quitarse
  const loadProducts = async ()=>{

    const {data} = await supabase
      .from("productos")
      .select("*");

    setProducts(data || []);

  };
  //y agarrar las funciones de abajo, me parece q las de modules

  const addProduct = (product:Product)=>{

    setCart([...cart,{...product,cantidad:1}]);

  };

  const createOrder = async ()=>{

    const mesa_id = localStorage.getItem("mesa_id");

    const {data:pedido} = await supabase
      .from("pedidos")
      .insert({
        mesa_id,
        estado:"pendiente"
      })
      .select()
      .single();

    for(const item of cart){

      await supabase
        .from("detalle_pedido")
        .insert({
          pedido_id:pedido.id,
          producto_id:item.id,
          cantidad:item.cantidad,
          precio_unitario:item.precio
        });

    }

    alert("Pedido enviado");

    router.push("/waiter/orders");

  };

  return(

    <div>

      <h1>Tomar Pedido</h1>

      {products.map(product => (

        <div key={product.id}>

          {product.nombre} - ${product.precio}

          <button onClick={()=>addProduct(product)}>
            Agregar
          </button>

        </div>

      ))}

      <button onClick={createOrder}>
        Enviar Pedido
      </button>

    </div>

  );
}