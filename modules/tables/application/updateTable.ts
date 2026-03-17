import { TableEntity, TableStatus } from "../domain/table";
import { TableRepository } from "../infrastructure/tableRepository";

// Caso de uso: Actualizar una mesa existente
export class UpdateTable {
  private tableRepository: TableRepository;

  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository;
  }

  async execute(
    id: string,
    number?: number,
    capacity?: number,
    status?: TableStatus
  ) {
    // Obtener mesa actual
    const existingTable = await this.tableRepository.getById(id);
    if (!existingTable) {
      throw new Error("Table not found");
    }

    // Crear entidad con datos actuales
    const tableEntity = new TableEntity({
      id: existingTable.id,
      number: existingTable.number,
      capacity: existingTable.capacity,
      status: existingTable.status,
    });

    // Aplicar cambios si se proporcionan
    if (number !== undefined) tableEntity.updateNumber(number);
    if (capacity !== undefined) tableEntity.updateCapacity(capacity);
    if (status) tableEntity.changeStatus(status);

    // Persistir cambios en el repositorio (Supabase)
    const updatedTable = await this.tableRepository.update(tableEntity);

    return updatedTable;
  }
}
