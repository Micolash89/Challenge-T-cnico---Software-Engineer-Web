import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  type: z.enum(['card', 'box']).default('card'),
  img: z.string().min(1, 'Image URL is required').url('Must be a valid URL'),
  price: z.string().min(1, 'Price is required'),
  priceArs: z.string().min(1, 'Price ARS must be at least 1'),
  rarity: z.string().min(1, 'Rarity is required'),
  rarityCode: z.string().min(1, 'Rarity code is required'),
  category: z.string().min(1, 'Category is required'),
  product_line_name: z.string().min(1, 'Product line is required'),
  productId: z.coerce.number().int().min(0, 'Product ID must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  type: z.enum(['card', 'box']).optional(),
  img: z
    .string()
    .min(1, 'Image URL is required')
    .url('Must be a valid URL')
    .optional(),
  price: z.string().min(1, 'Price is required').optional(),
  priceArs: z.string().min(1, 'Price ARS must be at least 1').optional(),
  rarity: z.string().min(1, 'Rarity is required').optional(),
  rarityCode: z.string().min(1, 'Rarity code is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  product_line_name: z.string().min(1, 'Product line is required').optional(),
  productId: z.coerce.number().int().min(0, 'Product ID must be a positive number').optional(),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or more').optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
