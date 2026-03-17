import { createClient } from "@supabase/supabase-js";
import { Sale, SaleEntity } from "../domain/sale";

// Variables de entorno (definidas en .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export class SaleRepository {
  // Obtener todas las ventas
  async getAll(): Promise<Sale[]> {
    const { data, error } = await supabase.from("ventas").select("*");
    if (error) throw error;
    return data as Sale[];
  }

  // Obtener venta por ID
  async getById(id: string): Promise<Sale | null> {
    const { data, error } = await supabase
      .from("ventas")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Sale;
  }

  // Crear venta
  async create(sale: SaleEntity): Promise<Sale> {
    const { data, error } = await supabase
      .from("ventas")
      .insert([
        {
          id: sale.id,
          order_id: sale.orderId,
          total: sale.total,
          payment_method: sale.paymentMethod,
          status: sale.status,
          created_at: sale.createdAt,
          updated_at: sale.updatedAt,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data as Sale;
  }

  // Actualizar venta
  async update(sale: SaleEntity): Promise<Sale> {
    const { data, error } = await supabase
      .from("ventas")
      .update({
        order_id: sale.orderId,
        total: sale.total,
        payment_method: sale.paymentMethod,
        status: sale.status,
        updated_at: new Date(),
      })
      .eq("id", sale.id)
      .select()
      .single();
    if (error) throw error;
    return data as Sale;
  }

  // Eliminar venta
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("ventas").delete().eq("id", id);
    if (error) throw error;
  }
}
