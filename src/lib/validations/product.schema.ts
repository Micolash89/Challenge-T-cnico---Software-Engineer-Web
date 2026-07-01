import { z } from 'zod';

const nonEmptyString = (label: string) =>
  z.string().min(1, `${label} es requerido`);

/** Convert checkbox FormData value ("on"/undefined) to boolean */
const checkboxBoolean = (msg: string) =>
  z.preprocess((val) => val === 'on' || val === true || val === 'true', z.boolean({ message: msg }));

export const createProductSchema = z.object({
  name: nonEmptyString('El nombre'),
  slug: nonEmptyString('El slug'),
  type: z.enum(['card', 'box']).default('card'),
  img: z.string().min(1, 'La URL de imagen es requerida').url('Debe ser una URL válida'),
  price: nonEmptyString('El precio'),
  rarity: nonEmptyString('La rareza'),
  rarityCode: nonEmptyString('El código de rareza'),
  category: nonEmptyString('La categoría'),
  product_line_name: nonEmptyString('La línea de producto'),
  productId: z.coerce.number().int('Debe ser un número entero').min(0, 'Debe ser un número positivo').catch(0),
  stock: z.coerce.number().int('Debe ser un número entero').min(0, 'El stock mínimo es 0'),
  active: checkboxBoolean('Estado inválido').default(true),
  featured: checkboxBoolean('Estado inválido').default(false),
});

export const updateProductSchema = z.object({
  name: nonEmptyString('El nombre').optional(),
  slug: nonEmptyString('El slug').optional(),
  type: z.enum(['card', 'box']).optional(),
  img: z.string().min(1, 'La URL de imagen es requerida').url('Debe ser una URL válida').optional(),
  price: nonEmptyString('El precio').optional(),
  rarity: nonEmptyString('La rareza').optional(),
  rarityCode: nonEmptyString('El código de rareza').optional(),
  category: nonEmptyString('La categoría').optional(),
  product_line_name: nonEmptyString('La línea de producto').optional(),
  productId: z.coerce.number().int('Debe ser un número entero').min(0, 'Debe ser un número positivo').optional(),
  stock: z.coerce.number().int('Debe ser un número entero').min(0, 'El stock mínimo es 0').optional(),
  active: checkboxBoolean('Estado inválido').optional(),
  featured: checkboxBoolean('Estado inválido').optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
