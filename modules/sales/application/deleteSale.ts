import { SaleRepository } from "../infrastructure/saleRepository";

// Caso de uso: Eliminar una venta
export class DeleteSale {
  private saleRepository: SaleRepository;

  constructor(saleRepository: SaleRepository) {
    this.saleRepository = saleRepository;
  }

  async execute(id: string): Promise<void> {
    // Verificar si la venta existe antes de eliminar
    const existingSale = await this.saleRepository.getById(id);
    if (!existingSale) {
      throw new Error("Sale not found");
    }

    // Eliminar venta en el repositorio (Supabase)
    await this.saleRepository.delete(id);
  }
}
