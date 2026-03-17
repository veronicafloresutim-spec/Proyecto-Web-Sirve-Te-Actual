// Dominio de Producto
// Define la entidad y sus reglas de negocio

export type ProductCategory = "drink" | "food" | "dessert";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

// Entidad con reglas de negocio
export class ProductEntity implements Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Omit<Product, "createdAt" | "updatedAt">) {
    this.id = props.id;
    this.name = props.name.trim();
    this.description = props.description.trim();
    this.price = props.price;
    this.category = props.category;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Validaciones de negocio
  validatePrice(): boolean {
    return this.price >= 0;
  }

  updateName(newName: string) {
    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  updateDescription(newDescription: string) {
    this.description = newDescription.trim();
    this.updatedAt = new Date();
  }

  updatePrice(newPrice: number) {
    if (newPrice < 0) throw new Error("Price cannot be negative");
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  changeCategory(newCategory: ProductCategory) {
    this.category = newCategory;
    this.updatedAt = new Date();
  }
}
