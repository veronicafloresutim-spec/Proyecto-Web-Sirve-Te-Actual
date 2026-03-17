// Dominio de Usuario
// Define la entidad y sus reglas de negocio

export type UserRole = "client" | "waiter" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // En producción se debe manejar con hashing
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Reglas de negocio básicas
export class UserEntity implements User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Omit<User, "createdAt" | "updatedAt">) {
    this.id = props.id;
    this.name = props.name.trim();
    this.email = props.email.toLowerCase();
    this.password = props.password;
    this.role = props.role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Validaciones de negocio
  validateEmail(): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(this.email);
  }

  changeRole(newRole: UserRole) {
    this.role = newRole;
    this.updatedAt = new Date();
  }

  updateName(newName: string) {
    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  updatePassword(newPassword: string) {
    this.password = newPassword;
    this.updatedAt = new Date();
  }
}
