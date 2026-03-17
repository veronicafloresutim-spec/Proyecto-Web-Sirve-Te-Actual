import { OrderDetail } from "../domain/orderDetail";
import { OrderDetailRepository } from "../infrastructure/orderDetailRepository";

// Caso de uso: Obtener un detalle de orden por ID
export class GetOrderDetail {
  private orderDetailRepository: OrderDetailRepository;

  constructor(orderDetailRepository: OrderDetailRepository) {
    this.orderDetailRepository = orderDetailRepository;
  }

  async execute(id: string): Promise<OrderDetail | null> {
    // Recuperar detalle desde el repositorio (Supabase)
    const detail = await this.orderDetailRepository.getById(id);

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como validar cantidad, precio o verificar que la orden asociada exista.
    return detail;
  }
}
