import { createClient } from "@supabase/supabase-js";
import { Table, TableEntity } from "../domain/table";

// Variables de entorno (definidas en .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export class TableRepository {
  // Obtener todas las mesas
  async getAll(): Promise<Table[]> {
    const { data, error } = await supabase.from("mesas").select("*");
    if (error) throw error;
    return data as Table[];
  }

  // Obtener mesa por ID
  async getById(id: string): Promise<Table | null> {
    const { data, error } = await supabase
      .from("mesas")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Table;
  }

  // Crear mesa
  async create(table: TableEntity): Promise<Table> {
    const { data, error } = await supabase
      .from("mesas")
      .insert([
        {
          id: table.id,
          number: table.number,
          capacity: table.capacity,
          status: table.status,
          created_at: table.createdAt,
          updated_at: table.updatedAt,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data as Table;
  }

  // Actualizar mesa
  async update(table: TableEntity): Promise<Table> {
    const { data, error } = await supabase
      .from("mesas")
      .update({
        number: table.number,
        capacity: table.capacity,
        status: table.status,
        updated_at: new Date(),
      })
      .eq("id", table.id)
      .select()
      .single();
    if (error) throw error;
    return data as Table;
  }

  // Eliminar mesa
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("mesas").delete().eq("id", id);
    if (error) throw error;
  }
}
