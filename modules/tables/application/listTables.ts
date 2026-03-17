import { Table } from "../domain/table";
import { TableRepository } from "../infrastructure/tableRepository";

// Caso de uso: Listar mesas
export class ListTables {
  private tableRepository: TableRepository;

  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository;
  }

  async execute(): Promise<Table[]> {
    // Recuperar todas las mesas desde el repositorio (Supabase)
    const tables = await this.tableRepository.getAll();

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como filtrar por estado (available, reserved, occupied),
    // ordenar por número de mesa, etc.
    return tables;
  }
}
