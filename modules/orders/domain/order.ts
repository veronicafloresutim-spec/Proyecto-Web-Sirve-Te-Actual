// Dominio de Orden
// Define la entidad y sus reglas de negocio

export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Order {
  id: string;
  tableId: string;        // ID de la mesa asociada
  products: string[];     // IDs de productos incluidos en la orden
  total: number;          // Total calculado de la orden
  status: OrderStatus;    // Estado actual de la orden
  createdAt: Date;
  updatedAt: Date;
}

// Entidad con reglas de negocio
export class OrderEntity implements Order {
  id: string;
  tableId: string;
  products: string[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Omit<Order, "createdAt" | "updatedAt">) {
    this.id = props.id;
    this.tableId = props.tableId;
    this.products = props.products;
    this.total = props.total;
    this.status = props.status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Validaciones de negocio
  validateTotal(): boolean {
    return this.total >= 0;
  }

  addProduct(productId: string, price: number) {
    this.products.push(productId);
    this.total += price;
    this.updatedAt = new Date();
  }

  removeProduct(productId: string, price: number) {
    this.products = this.products.filter(p => p !== productId);
    this.total -= price;
    if (this.total < 0) this.total = 0;
    this.updatedAt = new Date();
  }

  changeStatus(newStatus: OrderStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}
