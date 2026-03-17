import { Order } from "../domain/order";
import { OrderRepository } from "../infrastructure/orderRepository";

// Caso de uso: Listar órdenes
export class ListOrders {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(): Promise<Order[]> {
    // Recuperar todas las órdenes desde el repositorio (Supabase)
    const orders = await this.orderRepository.getAll();

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como filtrar por estado (pending, completed, cancelled),
    // ordenar por fecha de creación, etc.
    return orders;
  }
}
