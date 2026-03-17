import { OrderEntity, OrderStatus } from "../domain/order";
import { OrderRepository } from "../infrastructure/orderRepository";

// Caso de uso: Actualizar una orden existente
export class UpdateOrder {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(
    id: string,
    tableId?: string,
    products?: string[],
    total?: number,
    status?: OrderStatus
  ) {
    // Obtener orden actual
    const existingOrder = await this.orderRepository.getById(id);
    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Crear entidad con datos actuales
    const orderEntity = new OrderEntity({
      id: existingOrder.id,
      tableId: existingOrder.tableId,
      products: existingOrder.products,
      total: existingOrder.total,
      status: existingOrder.status,
    });

    // Aplicar cambios si se proporcionan
    if (tableId !== undefined) orderEntity.tableId = tableId;
    if (products !== undefined) orderEntity.products = products;
    if (total !== undefined) {
      orderEntity.total = total;
      if (!orderEntity.validateTotal()) {
        throw new Error("Invalid order total");
      }
    }
    if (status) orderEntity.changeStatus(status);

    // Persistir cambios en el repositorio (Supabase)
    const updatedOrder = await this.orderRepository.update(orderEntity);

    return updatedOrder;
  }
}
