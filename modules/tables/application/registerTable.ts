import { TableEntity, TableStatus } from "../domain/table";
import { TableRepository } from "../infrastructure/tableRepository";

// Caso de uso: Registrar una nueva mesa
export class RegisterTable {
  private tableRepository: TableRepository;

  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository;
  }

  async execute(
    id: string,
    number: number,
    capacity: number,
    status: TableStatus
  ) {
    // Crear entidad de mesa
    const table = new TableEntity({
      id,
      number,
      capacity,
      status,
    });

    // Validar capacidad antes de persistir
    if (!table.validateCapacity()) {
      throw new Error("Invalid table capacity");
    }

    // Persistir en el repositorio (Supabase)
    const createdTable = await this.tableRepository.create(table);

    return createdTable;
  }
}
