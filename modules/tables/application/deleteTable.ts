import { TableRepository } from "../infrastructure/tableRepository";

// Caso de uso: Eliminar una mesa
export class DeleteTable {
  private tableRepository: TableRepository;

  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository;
  }

  async execute(id: string): Promise<void> {
    // Verificar si la mesa existe antes de eliminar
    const existingTable = await this.tableRepository.getById(id);
    if (!existingTable) {
      throw new Error("Table not found");
    }

    // Eliminar mesa en el repositorio (Supabase)
    await this.tableRepository.delete(id);
  }
}
