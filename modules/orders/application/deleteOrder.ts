import { OrderRepository } from "../infrastructure/orderRepository";

// Caso de uso: Eliminar una orden
export class DeleteOrder {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(id: string): Promise<void> {
    // Verificar si la orden existe antes de eliminar
    const existingOrder = await this.orderRepository.getById(id);
    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Eliminar orden en el repositorio (Supabase)
    await this.orderRepository.delete(id);
  }
}
