export type Role = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
  phone?: string;
  avatar: string;
  schoolId?: string; // MSSV or Staff ID
  classroom?: string;
  department?: string;
  canteenBranch?: string;
}

export type DishCategory = 'lunch' | 'snacks' | 'drinks' | 'desserts' | 'combos';

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  categoryName: string;
  price: number;
  originalPrice?: number;
  description: string;
  img: string;
  inStock: boolean;
  prepTimeMinutes: number;
  rating: number;
  reviewCount: number;
  orderCount: number;
  badge?: string;
  badgeType?: 'hot' | 'sale' | 'new';
  isCombo?: boolean;
  comboItems?: string[];
}

export interface DishReview {
  id: string;
  orderId: string;
  dishId: string;
  dishName: string;
  studentId: string;
  studentName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  tags?: string[];
  adminReply?: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'qr_bank' | 'qr_momo' | 'cash';
export type PaymentStatus = 'paid' | 'pending';

export interface OrderItem {
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  img: string;
  notes?: string;
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  deliveryArea: string;
  detailedAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  studentNotes?: string;
  staffNotes?: string;
  estimatedMinutes: number;
  qrRef?: string;
}

export interface RevenueStats {
  todayRevenue: number;
  todayOrderCount: number;
  weekRevenue: number;
  monthRevenue: number;
  completedOrders: number;
  cancelledOrders: number;
  avgOrderValue: number;
  paymentStats: {
    qrBank: number;
    qrMomo: number;
    cash: number;
  };
  dailyRevenue: {
    date: string;
    dayName: string;
    revenue: number;
    orderCount: number;
  }[];
  topDishes: {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
    img: string;
  }[];
}
