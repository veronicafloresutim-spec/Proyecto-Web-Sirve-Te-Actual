import { Product } from "../domain/product";
import { ProductRepository } from "../infrastructure/productRepository";

// Caso de uso: Obtener un producto por ID
export class GetProduct {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(id: string): Promise<Product | null> {
    // Recuperar producto desde el repositorio (Supabase)
    const product = await this.productRepository.getById(id);

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como verificar disponibilidad, categoría o estado.
    return product;
  }
}
