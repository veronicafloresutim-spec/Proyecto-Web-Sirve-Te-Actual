// Dominio de Mesa
// Define la entidad y sus reglas de negocio

export type TableStatus = "available" | "occupied" | "reserved";

export interface Table {
  id: string;
  number: number;       // Número de mesa visible para clientes
  capacity: number;     // Número máximo de personas
  status: TableStatus;  // Estado actual de la mesa
  createdAt: Date;
  updatedAt: Date;
}

// Entidad con reglas de negocio
export class TableEntity implements Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Omit<Table, "createdAt" | "updatedAt">) {
    this.id = props.id;
    this.number = props.number;
    this.capacity = props.capacity;
    this.status = props.status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Validaciones de negocio
  validateCapacity(): boolean {
    return this.capacity > 0;
  }

  updateNumber(newNumber: number) {
    if (newNumber <= 0) throw new Error("Table number must be positive");
    this.number = newNumber;
    this.updatedAt = new Date();
  }

  updateCapacity(newCapacity: number) {
    if (newCapacity <= 0) throw new Error("Capacity must be greater than zero");
    this.capacity = newCapacity;
    this.updatedAt = new Date();
  }

  changeStatus(newStatus: TableStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}
