import { Sale } from "../domain/sale";
import { SaleRepository } from "../infrastructure/saleRepository";

// Caso de uso: Listar ventas
export class ListSales {
  private saleRepository: SaleRepository;

  constructor(saleRepository: SaleRepository) {
    this.saleRepository = saleRepository;
  }

  async execute(): Promise<Sale[]> {
    // Recuperar todas las ventas desde el repositorio (Supabase)
    const sales = await this.saleRepository.getAll();

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como filtrar por estado, agrupar por método de pago,
    // o calcular totales por periodo.
    return sales;
  }
}
