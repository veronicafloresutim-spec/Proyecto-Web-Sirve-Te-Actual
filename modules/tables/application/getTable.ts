import { Table } from "../domain/table";
import { TableRepository } from "../infrastructure/tableRepository";

// Caso de uso: Obtener una mesa por ID
export class GetTable {
  private tableRepository: TableRepository;

  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository;
  }

  async execute(id: string): Promise<Table | null> {
    // Recuperar mesa desde el repositorio (Supabase)
    const table = await this.tableRepository.getById(id);

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como verificar disponibilidad o estado de la mesa.
    return table;
  }
}
