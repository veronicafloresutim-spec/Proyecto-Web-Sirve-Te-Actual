import { OrderDetailEntity } from "../domain/orderDetail";
import { OrderDetailRepository } from "../infrastructure/orderDetailRepository";

// Caso de uso: Registrar un nuevo detalle de orden
export class RegisterOrderDetail {
  private orderDetailRepository: OrderDetailRepository;

  constructor(orderDetailRepository: OrderDetailRepository) {
    this.orderDetailRepository = orderDetailRepository;
  }

  async execute(
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: number
  ) {
    // Crear entidad de detalle de orden
    const orderDetail = new OrderDetailEntity({
      id,
      orderId,
      productId,
      quantity,
      price,
    });

    // Validar cantidad antes de persistir
    if (!orderDetail.validateQuantity()) {
      throw new Error("Invalid quantity: must be greater than 0");
    }

    // Persistir en el repositorio (Supabase)
    const createdDetail = await this.orderDetailRepository.create(orderDetail);

    return createdDetail;
  }
}
