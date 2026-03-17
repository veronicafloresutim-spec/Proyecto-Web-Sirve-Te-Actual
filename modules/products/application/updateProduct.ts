import { ProductEntity, ProductCategory } from "../domain/product";
import { ProductRepository } from "../infrastructure/productRepository";

// Caso de uso: Actualizar un producto existente
export class UpdateProduct {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(
    id: string,
    name?: string,
    description?: string,
    price?: number,
    category?: ProductCategory
  ) {
    // Obtener producto actual
    const existingProduct = await this.productRepository.getById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Crear entidad con datos actuales
    const productEntity = new ProductEntity({
      id: existingProduct.id,
      name: existingProduct.name,
      description: existingProduct.description,
      price: existingProduct.price,
      category: existingProduct.category,
    });

    // Aplicar cambios si se proporcionan
    if (name) productEntity.updateName(name);
    if (description) productEntity.updateDescription(description);
    if (price !== undefined) productEntity.updatePrice(price);
    if (category) productEntity.changeCategory(category);

    // Persistir cambios en el repositorio (Supabase)
    const updatedProduct = await this.productRepository.update(productEntity);

    return updatedProduct;
  }
}
