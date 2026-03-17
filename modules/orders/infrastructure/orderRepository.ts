import { createClient } from "@supabase/supabase-js";
import { Order, OrderEntity } from "../domain/order";

// Variables de entorno (definidas en .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export class OrderRepository {
  // Obtener todas las órdenes
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase.from("ordenes").select("*");
    if (error) throw error;
    return data as Order[];
  }

  // Obtener orden por ID
  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("ordenes")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Order;
  }

  // Crear orden
  async create(order: OrderEntity): Promise<Order> {
    const { data, error } = await supabase
      .from("ordenes")
      .insert([
        {
          id: order.id,
          table_id: order.tableId,
          products: order.products,
          total: order.total,
          status: order.status,
          created_at: order.createdAt,
          updated_at: order.updatedAt,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  }

  // Actualizar orden
  async update(order: OrderEntity): Promise<Order> {
    const { data, error } = await supabase
      .from("ordenes")
      .update({
        table_id: order.tableId,
        products: order.products,
        total: order.total,
        status: order.status,
        updated_at: new Date(),
      })
      .eq("id", order.id)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  }

  // Eliminar orden
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("ordenes").delete().eq("id", id);
    if (error) throw error;
  }
}
