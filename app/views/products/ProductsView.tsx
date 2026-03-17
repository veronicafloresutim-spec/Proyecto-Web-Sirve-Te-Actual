"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"

type Product = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
}

export default function ProductsPage(){

  const [products,setProducts] = useState<Product[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const loadProducts = async ()=>{

      const { data } = await supabase
        .from("productos")
        .select("*")
        .order("categoria")

      setProducts(data || [])
      setLoading(false)

    }

    loadProducts()

  },[])

  if(loading){
    return <p className="text-center mt-20 text-gray-500 text-lg">Cargando menú...</p>
  }

  return(

    <div className="max-w-7xl mx-auto px-4">

      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
        🍽 Menú del Restaurante
      </h1>

      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-6
      ">

        {products.map((p)=>(

          <div
            key={p.id}
            className="
            border
            rounded-xl
            p-6
            bg-white
            shadow-sm
            hover:shadow-xl
            transition
            flex
            flex-col
            justify-between
            min-h-[200px]
            "
          >

            <div>

              <span className="
                text-xs
                md:text-sm
                bg-gray-100
                text-gray-600
                px-3
                py-1
                rounded-full
                inline-block
                mb-3
              ">
                {p.categoria}
              </span>

              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                {p.nombre}
              </h2>

              <p className="text-gray-500 text-sm md:text-base mb-6">
                {p.descripcion}
              </p>

            </div>

            <div className="flex justify-between items-center">

              <span className="text-2xl md:text-3xl font-bold text-green-600">
                ${p.precio.toFixed(2)}
              </span>

              <button
                className="
                bg-green-500
                text-white
                px-5
                py-2
                md:px-6
                md:py-3
                rounded-lg
                hover:bg-green-600
                transition
                text-sm
                md:text-base
                "
              >
                Agregar
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}