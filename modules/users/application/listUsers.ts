import { User } from "../domain/user";
import { UserRepository } from "../infrastructure/userRepository";

// Caso de uso: Listar usuarios
export class ListUsers {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<User[]> {
    // Recuperar todos los usuarios desde el repositorio (Supabase)
    const users = await this.userRepository.getAll();

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como filtrar por rol, ordenar por fecha, etc.
    return users;
  }
}
