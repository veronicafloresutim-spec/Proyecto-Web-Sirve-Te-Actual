import { Product } from "../domain/product";
import { ProductRepository } from "../infrastructure/productRepository";

// Caso de uso: Listar productos
export class ListProducts {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<Product[]> {
    // Recuperar todos los productos desde el repositorio (Supabase)
    const products = await this.productRepository.getAll();

    // Aquí podrías aplicar reglas de negocio adicionales,
    // como filtrar por categoría, ordenar por precio, etc.
    return products;
  }
}
