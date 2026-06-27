'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/types/product.types';

function buildCartItem(product: Product, quantity = 1): CartItem {
  return {
    ...product,
    quantity,
    cost: product.price_ars * quantity,
  };
}

function recalcCost(item: CartItem): CartItem {
  return { ...item, cost: item.price_ars * item.quantity };
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.id === product.id,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? recalcCost({
                      ...item,
                      quantity: item.quantity + quantity,
                    })
                  : item,
              ),
            };
          }
          return { items: [...state.items, buildCartItem(product, quantity)] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.id === productId ? recalcCost({ ...item, quantity }) : item,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'tcg-cart',
    },
  ),
);
