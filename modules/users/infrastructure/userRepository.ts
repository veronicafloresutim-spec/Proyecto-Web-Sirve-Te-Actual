import { createClient } from "@supabase/supabase-js";
import { User, UserEntity } from "../domain/user";

// Variables de entorno (se definen en .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export class UserRepository {
  // Obtener todos los usuarios
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase.from("usuarios").select("*");
    if (error) throw error;
    return data as User[];
  }

  // Obtener usuario por ID
  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as User;
  }

  // Crear usuario
  async create(user: UserEntity): Promise<User> {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password, // ⚠️ En producción: usar hashing
          role: user.role,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data as User;
  }

  // Actualizar usuario
  async update(user: UserEntity): Promise<User> {
    const { data, error } = await supabase
      .from("usuarios")
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        updated_at: new Date(),
      })
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  }

  // Eliminar usuario
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("usuarios").delete().eq("id", id);
    if (error) throw error;
  }
}
