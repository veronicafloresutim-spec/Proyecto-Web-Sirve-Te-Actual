"use client";

import { useEffect,useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Order = {
  id:string
  estado:string
  mesa_id:string
};

export default function OrdersPage(){

  const [orders,setOrders] = useState<Order[]>([]);

  useEffect(()=>{
    loadOrders();
  },[]);

  const loadOrders = async ()=>{

    const {data} = await supabase
      .from("pedidos")
      .select("*")
      .neq("estado","entregado");

    setOrders(data || []);

  };

  const updateStatus = async(id:string,status:string)=>{

    await supabase
      .from("pedidos")
      .update({estado:status})
      .eq("id",id);

    loadOrders();

  };

  return(

    <div>

      <h1>Pedidos Activos</h1>

      {orders.map(order => (

        <div key={order.id}>

          Pedido {order.id}

          <p>Estado: {order.estado}</p>

          <button
          onClick={()=>updateStatus(order.id,"preparando")}
          >
            Preparando
          </button>

          <button
          onClick={()=>updateStatus(order.id,"listo")}
          >
            Listo
          </button>

          <button
          onClick={()=>updateStatus(order.id,"entregado")}
          >
            Entregado
          </button>

        </div>

      ))}

    </div>

  );
}