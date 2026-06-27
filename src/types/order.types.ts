import type { CartItem } from './product.types';

export interface OrderRequest {
  total: string;
  items: CartItem[];
}

export interface OrderResponse {
  order_number: string;
}
