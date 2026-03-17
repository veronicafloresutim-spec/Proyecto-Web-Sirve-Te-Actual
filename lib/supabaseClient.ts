import { createClient } from "@supabase/supabase-js";

// Variables de entorno para la conexión
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string;

// Validación: si faltan variables, lanzar error claro
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are not defined");
}

// Cliente de Supabase centralizado
export const supabase = createClient(supabaseUrl, supabaseKey);
