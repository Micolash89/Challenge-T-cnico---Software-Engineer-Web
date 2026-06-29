import type { CartItem } from './product.types';

export interface OrderRequest {
  total: string;
  items: CartItem[];
}

export interface OrderResponse {
  order_number: string;
}

export interface AdminOrder {
  id: string;
  userId: string | null;
  status: 'reservado' | 'pagado' | 'cancelado';
  paymentMethod: 'mercadopago' | 'whatsapp_efectivo';
  totalArs: number;
  mpPaymentId: string | null;
  whatsappSent: boolean;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceArsAtPurchase: number;
  productName: string;
  productImg: string;
  productRarity: string;
}

export interface OrderMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}
