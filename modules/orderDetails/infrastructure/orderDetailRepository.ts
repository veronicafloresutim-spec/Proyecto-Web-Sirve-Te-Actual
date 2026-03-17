import { createClient } from "@supabase/supabase-js";
import { OrderDetail, OrderDetailEntity } from "../domain/orderDetail";

// Variables de entorno (definidas en .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export class OrderDetailRepository {
  // Obtener todos los detalles de órdenes
  async getAll(): Promise<OrderDetail[]> {
    const { data, error } = await supabase.from("detalles_ordenes").select("*");
    if (error) throw error;
    return data as OrderDetail[];
  }

  // Obtener detalle por ID
  async getById(id: string): Promise<OrderDetail | null> {
    const { data, error } = await supabase
      .from("detalles_ordenes")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as OrderDetail;
  }

  // Crear detalle de orden
  async create(orderDetail: OrderDetailEntity): Promise<OrderDetail> {
    const { data, error } = await supabase
      .from("detalles_ordenes")
      .insert([
        {
          id: orderDetail.id,
          order_id: orderDetail.orderId,
          product_id: orderDetail.productId,
          quantity: orderDetail.quantity,
          price: orderDetail.price,
          subtotal: orderDetail.subtotal,
          created_at: orderDetail.createdAt,
          updated_at: orderDetail.updatedAt,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data as OrderDetail;
  }

  // Actualizar detalle de orden
  async update(orderDetail: OrderDetailEntity): Promise<OrderDetail> {
    const { data, error } = await supabase
      .from("detalles_ordenes")
      .update({
        order_id: orderDetail.orderId,
        product_id: orderDetail.productId,
        quantity: orderDetail.quantity,
        price: orderDetail.price,
        subtotal: orderDetail.subtotal,
        updated_at: new Date(),
      })
      .eq("id", orderDetail.id)
      .select()
      .single();
    if (error) throw error;
    return data as OrderDetail;
  }

  // Eliminar detalle de orden
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("detalles_ordenes").delete().eq("id", id);
    if (error) throw error;
  }
}
