import { ProductRepository } from "../infrastructure/productRepository";

// Caso de uso: Eliminar un producto
export class DeleteProduct {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(id: string): Promise<void> {
    // Verificar si el producto existe antes de eliminar
    const existingProduct = await this.productRepository.getById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Eliminar producto en el repositorio (Supabase)
    await this.productRepository.delete(id);
  }
}
