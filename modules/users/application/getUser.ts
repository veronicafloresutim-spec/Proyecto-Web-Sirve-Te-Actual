import { User } from "../domain/user";
import { UserRepository } from "../infrastructure/userRepository";

// Caso de uso: Obtener un usuario por ID
export class GetUser {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<User | null> {
    // Recuperar usuario desde el repositorio (Supabase)
    const user = await this.userRepository.getById(id);

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como verificar permisos, roles o estados.
    return user;
  }
}
