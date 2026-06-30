export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
  },
  CHECKOUT: {
    SUCCESS: '/checkout/success',
    FAILURE: '/checkout/failure',
  },
} as const;

export function catalogRoute(productLine: string): string {
  return `/${productLine}`;
}

export function productDetailRoute(productLine: string, id: string): string {
  return `/${productLine}/${id}`;
}
