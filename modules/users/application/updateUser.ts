import { UserEntity, UserRole } from "../domain/user";
import { UserRepository } from "../infrastructure/userRepository";

// Caso de uso: Actualizar un usuario existente
export class UpdateUser {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(
    id: string,
    name?: string,
    email?: string,
    password?: string,
    role?: UserRole
  ) {
    // Obtener usuario actual
    const existingUser = await this.userRepository.getById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Crear entidad con datos actuales
    const userEntity = new UserEntity({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      password: existingUser.password,
      role: existingUser.role,
    });

    // Aplicar cambios si se proporcionan
    if (name) userEntity.updateName(name);
    if (email) {
      userEntity.email = email.toLowerCase();
      if (!userEntity.validateEmail()) {
        throw new Error("Invalid email format");
      }
    }
    if (password) userEntity.updatePassword(password);
    if (role) userEntity.changeRole(role);

    // Persistir cambios en el repositorio (Supabase)
    const updatedUser = await this.userRepository.update(userEntity);

    return updatedUser;
  }
}
