import { ProductEntity, ProductCategory } from "../domain/product";
import { ProductRepository } from "../infrastructure/productRepository";

// Caso de uso: Registrar un nuevo producto
export class RegisterProduct {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(
    id: string,
    name: string,
    description: string,
    price: number,
    category: ProductCategory
  ) {
    // Crear entidad de producto
    const product = new ProductEntity({
      id,
      name,
      description,
      price,
      category,
    });

    // Validar precio antes de persistir
    if (!product.validatePrice()) {
      throw new Error("Invalid product price");
    }

    // Persistir en el repositorio (Supabase)
    const createdProduct = await this.productRepository.create(product);

    return createdProduct;
  }
}
