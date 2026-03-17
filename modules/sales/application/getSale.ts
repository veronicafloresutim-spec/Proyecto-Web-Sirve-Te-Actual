import { Sale } from "../domain/sale";
import { SaleRepository } from "../infrastructure/saleRepository";

// Caso de uso: Obtener una venta por ID
export class GetSale {
  private saleRepository: SaleRepository;

  constructor(saleRepository: SaleRepository) {
    this.saleRepository = saleRepository;
  }

  async execute(id: string): Promise<Sale | null> {
    // Recuperar venta desde el repositorio (Supabase)
    const sale = await this.saleRepository.getById(id);

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como verificar estado de la venta, validar total,
    // o comprobar que la orden asociada exista.
    return sale;
  }
}
