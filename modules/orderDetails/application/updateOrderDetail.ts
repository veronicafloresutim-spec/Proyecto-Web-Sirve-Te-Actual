import { OrderDetailEntity } from "../domain/orderDetail";
import { OrderDetailRepository } from "../infrastructure/orderDetailRepository";

// Caso de uso: Actualizar un detalle de orden existente
export class UpdateOrderDetail {
  private orderDetailRepository: OrderDetailRepository;

  constructor(orderDetailRepository: OrderDetailRepository) {
    this.orderDetailRepository = orderDetailRepository;
  }

  async execute(
    id: string,
    quantity?: number,
    price?: number
  ) {
    // Obtener detalle actual
    const existingDetail = await this.orderDetailRepository.getById(id);
    if (!existingDetail) {
      throw new Error("Order detail not found");
    }

    // Crear entidad con datos actuales
    const detailEntity = new OrderDetailEntity({
      id: existingDetail.id,
      orderId: existingDetail.orderId,
      productId: existingDetail.productId,
      quantity: existingDetail.quantity,
      price: existingDetail.price,
    });

    // Aplicar cambios si se proporcionan
    if (quantity !== undefined) {
      detailEntity.updateQuantity(quantity);
    }
    if (price !== undefined) {
      detailEntity.updatePrice(price);
    }

    // Persistir cambios en el repositorio (Supabase)
    const updatedDetail = await this.orderDetailRepository.update(detailEntity);

    return updatedDetail;
  }
}
