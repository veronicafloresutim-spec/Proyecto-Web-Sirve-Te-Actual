import { SaleEntity, SaleStatus } from "../domain/sale";
import { SaleRepository } from "../infrastructure/saleRepository";

// Caso de uso: Registrar una nueva venta
export class RegisterSale {
  private saleRepository: SaleRepository;

  constructor(saleRepository: SaleRepository) {
    this.saleRepository = saleRepository;
  }

  async execute(
    id: string,
    orderId: string,
    total: number,
    paymentMethod: string,
    status: SaleStatus
  ) {
    // Crear entidad de venta
    const sale = new SaleEntity({
      id,
      orderId,
      total,
      paymentMethod,
      status,
    });

    // Validar total antes de persistir
    if (!sale.validateTotal()) {
      throw new Error("Invalid total: must be greater or equal to 0");
    }

    // Persistir en el repositorio (Supabase)
    const createdSale = await this.saleRepository.create(sale);

    return createdSale;
  }
}
