import { OrderDetail } from "../domain/orderDetail";
import { OrderDetailRepository } from "../infrastructure/orderDetailRepository";

// Caso de uso: Listar detalles de órdenes
export class ListOrderDetails {
  private orderDetailRepository: OrderDetailRepository;

  constructor(orderDetailRepository: OrderDetailRepository) {
    this.orderDetailRepository = orderDetailRepository;
  }

  async execute(): Promise<OrderDetail[]> {
    // Recuperar todos los detalles desde el repositorio (Supabase)
    const details = await this.orderDetailRepository.getAll();

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como filtrar por orden específica, agrupar por producto,
    // o calcular totales por orden.
    return details;
  }
}
