import { OrderEntity, OrderStatus } from "../domain/order";
import { OrderRepository } from "../infrastructure/orderRepository";

// Caso de uso: Registrar una nueva orden
export class RegisterOrder {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(
    id: string,
    tableId: string,
    products: string[],
    total: number,
    status: OrderStatus = "pending"
  ) {
    // Crear entidad de orden
    const order = new OrderEntity({
      id,
      tableId,
      products,
      total,
      status,
    });

    // Validar total antes de persistir
    if (!order.validateTotal()) {
      throw new Error("Invalid order total");
    }

    // Persistir en el repositorio (Supabase)
    const createdOrder = await this.orderRepository.create(order);

    return createdOrder;
  }
}
