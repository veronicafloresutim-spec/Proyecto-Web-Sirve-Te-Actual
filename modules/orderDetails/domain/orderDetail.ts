// Dominio de Detalle de Orden
// Define la entidad y sus reglas de negocio

export interface OrderDetail {
    id: string;
    orderId: string;       // ID de la orden asociada
    productId: string;     // ID del producto
    quantity: number;      // Cantidad del producto
    price: number;         // Precio unitario
    subtotal: number;      // subtotal = quantity * price
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Entidad con reglas de negocio
  export class OrderDetailEntity implements OrderDetail {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(props: Omit<OrderDetail, "createdAt" | "updatedAt" | "subtotal">) {
      this.id = props.id;
      this.orderId = props.orderId;
      this.productId = props.productId;
      this.quantity = props.quantity;
      this.price = props.price;
      this.subtotal = this.calculateSubtotal();
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    // Calcular subtotal
    private calculateSubtotal(): number {
      return this.quantity * this.price;
    }
  
    // Validar cantidad
    validateQuantity(): boolean {
      return this.quantity > 0;
    }
  
    // Actualizar cantidad
    updateQuantity(newQuantity: number) {
      if (newQuantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }
      this.quantity = newQuantity;
      this.subtotal = this.calculateSubtotal();
      this.updatedAt = new Date();
    }
  
    // Actualizar precio
    updatePrice(newPrice: number) {
      if (newPrice < 0) {
        throw new Error("Price cannot be negative");
      }
      this.price = newPrice;
      this.subtotal = this.calculateSubtotal();
      this.updatedAt = new Date();
    }
  }
  