import { UserRepository } from "../infrastructure/userRepository";

// Caso de uso: Eliminar un usuario
export class DeleteUser {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<void> {
    // Verificar si el usuario existe antes de eliminar
    const existingUser = await this.userRepository.getById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Eliminar usuario en el repositorio (Supabase)
    await this.userRepository.delete(id);
  }
}
