import { OrderDetailRepository } from "../infrastructure/orderDetailRepository";

// Caso de uso: Eliminar un detalle de orden
export class DeleteOrderDetail {
  private orderDetailRepository: OrderDetailRepository;

  constructor(orderDetailRepository: OrderDetailRepository) {
    this.orderDetailRepository = orderDetailRepository;
  }

  async execute(id: string): Promise<void> {
    // Verificar si el detalle existe antes de eliminar
    const existingDetail = await this.orderDetailRepository.getById(id);
    if (!existingDetail) {
      throw new Error("Order detail not found");
    }

    // Eliminar detalle en el repositorio (Supabase)
    await this.orderDetailRepository.delete(id);
  }
}
