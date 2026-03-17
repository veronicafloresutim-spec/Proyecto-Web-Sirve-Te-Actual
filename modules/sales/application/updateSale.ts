import { SaleEntity, SaleStatus } from "../domain/sale";
import { SaleRepository } from "../infrastructure/saleRepository";

// Caso de uso: Actualizar una venta existente
export class UpdateSale {
  private saleRepository: SaleRepository;

  constructor(saleRepository: SaleRepository) {
    this.saleRepository = saleRepository;
  }

  async execute(
    id: string,
    status?: SaleStatus,
    paymentMethod?: string,
    total?: number
  ) {
    // Obtener venta actual
    const existingSale = await this.saleRepository.getById(id);
    if (!existingSale) {
      throw new Error("Sale not found");
    }

    // Crear entidad con datos actuales
    const saleEntity = new SaleEntity({
      id: existingSale.id,
      orderId: existingSale.orderId,
      total: existingSale.total,
      paymentMethod: existingSale.paymentMethod,
      status: existingSale.status,
    });

    // Aplicar cambios si se proporcionan
    if (status !== undefined) {
      saleEntity.changeStatus(status);
    }
    if (paymentMethod !== undefined) {
      saleEntity.updatePaymentMethod(paymentMethod);
    }
    if (total !== undefined) {
      if (total < 0) {
        throw new Error("Total cannot be negative");
      }
      saleEntity.total = total;
      saleEntity.updatedAt = new Date();
    }

    // Persistir cambios en el repositorio (Supabase)
    const updatedSale = await this.saleRepository.update(saleEntity);

    return updatedSale;
  }
}
