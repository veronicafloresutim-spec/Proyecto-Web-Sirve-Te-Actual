import { Order } from "../domain/order";
import { OrderRepository } from "../infrastructure/orderRepository";

// Caso de uso: Obtener una orden por ID
export class GetOrder {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(id: string): Promise<Order | null> {
    // Recuperar orden desde el repositorio (Supabase)
    const order = await this.orderRepository.getById(id);

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como verificar estado de la orden o validar mesa asociada.
    return order;
  }
}
