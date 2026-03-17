import { createClient } from "@supabase/supabase-js";
import { Product, ProductEntity } from "../domain/product";

// Variables de entorno (definidas en .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export class ProductRepository {
  // Obtener todos los productos
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase.from("productos").select("*");
    if (error) throw error;
    return data as Product[];
  }

  // Obtener producto por ID
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Product;
  }

  // Crear producto
  async create(product: ProductEntity): Promise<Product> {
    const { data, error } = await supabase
      .from("productos")
      .insert([
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          created_at: product.createdAt,
          updated_at: product.updatedAt,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  }

  // Actualizar producto
  async update(product: ProductEntity): Promise<Product> {
    const { data, error } = await supabase
      .from("productos")
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        updated_at: new Date(),
      })
      .eq("id", product.id)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  }

  // Eliminar producto
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) throw error;
  }
}
