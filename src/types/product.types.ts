export interface Product {
  id: string;
  name: string;
  slug: string;
  type: 'card' | 'box';
  img: string;
  price: string;
  priceArs: string; // Coincide con schema.ts (decimal)
  rarity: string;
  rarityCode: string;
  category: string;
  product_line_name: string;
  productId: number;
  stock: number;
  active: boolean;
  featured: boolean;
  createdAt: Date; // Drizzle usa Date para timestamps
  updatedAt: Date;
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
