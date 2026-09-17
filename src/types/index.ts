export type Role = 'ADMIN' | 'MERCHANT' | 'USER';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

export type PaymentMethod = 'BAKONG_KHQR' | 'CASH_ON_DELIVERY';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  images: string[];
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  md5?: string;
  khqrString?: string;
  deepLink?: string;
  transactionId?: string;
  rawResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface FilterProductParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}
