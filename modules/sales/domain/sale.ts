// Dominio de Venta
// Define la entidad y sus reglas de negocio

export interface Sale {
    id: string;
    orderId: string;       // ID de la orden asociada
    total: number;         // Total de la venta
    paymentMethod: string; // Método de pago (efectivo, tarjeta, etc.)
    status: SaleStatus;    // Estado de la venta
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type SaleStatus = "pending" | "paid" | "cancelled";
  
  // Entidad con reglas de negocio
  export class SaleEntity implements Sale {
    id: string;
    orderId: string;
    total: number;
    paymentMethod: string;
    status: SaleStatus;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(props: Omit<Sale, "createdAt" | "updatedAt">) {
      this.id = props.id;
      this.orderId = props.orderId;
      this.total = props.total;
      this.paymentMethod = props.paymentMethod;
      this.status = props.status;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    // Validar total
    validateTotal(): boolean {
      return this.total >= 0;
    }
  
    // Cambiar estado de la venta
    changeStatus(newStatus: SaleStatus) {
      this.status = newStatus;
      this.updatedAt = new Date();
    }
  
    // Actualizar método de pago
    updatePaymentMethod(newMethod: string) {
      if (!newMethod) {
        throw new Error("Payment method cannot be empty");
      }
      this.paymentMethod = newMethod;
      this.updatedAt = new Date();
    }
  }
  