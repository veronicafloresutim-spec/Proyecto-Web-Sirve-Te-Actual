import { UserEntity, UserRole } from "../domain/user";
import { UserRepository } from "../infrastructure/userRepository";

// Caso de uso: Registrar un nuevo usuario
export class RegisterUser {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(
    id: string,
    name: string,
    email: string,
    password: string,
    role: UserRole = "client"
  ) {
    // Crear entidad de usuario
    const user = new UserEntity({
      id,
      name,
      email,
      password,
      role,
    });

    // Validar email antes de persistir
    if (!user.validateEmail()) {
      throw new Error("Invalid email format");
    }

    // Persistir en el repositorio (Supabase)
    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }
}
