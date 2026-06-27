export interface Product {
  id: string;
  name: string;
  type: 'card' | 'box';
  img: string;
  price: string;
  price_ars: number;
  rarity: string;
  rarity_code: string;
  category: string;
  product_line_name: string;
  productId: number;
  stock: number;
  active: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  cost: number;
}

export interface DataProduct {
  data: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataSorts {
  categories: string[];
  rarities: string[];
}
