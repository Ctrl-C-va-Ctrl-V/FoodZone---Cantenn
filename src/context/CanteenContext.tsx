import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Dish, Order, CartItem, User, Role, OrderStatus, RevenueStats, DishReview } from '../types';
import { INITIAL_DISHES, INITIAL_ORDERS, DEMO_USERS, INITIAL_REVIEWS } from '../data/initialData';
import {
  initializeDatabaseSeed,
  subscribeToDishes,
  subscribeToOrders,
  subscribeToReviews,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  saveReviewToFirestore,
  updateReviewInFirestore,
  saveDishToFirestore,
  updateDishInFirestore,
  deleteDishFromFirestore,
} from '../services/canteenFirestore';

interface CanteenContextType {
  currentUser: User;
  isAuthenticated: boolean;
  isCloudConnected: boolean;
  login: (role: Role, customUser?: User) => void;
  logout: () => void;
  switchActor: (role: Role, customUser?: User) => void;
  dishes: Dish[];
  orders: Order[];
  reviews: DishReview[];
  submitReview: (reviewData: {
    orderId: string;
    dishId: string;
    dishName: string;
    rating: number;
    comment: string;
    tags?: string[];
  }) => Promise<void>;
  replyToReview: (reviewId: string, replyText: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (dish: Dish, quantity?: number, notes?: string) => void;
  updateCartQty: (dishId: string, quantity: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  placeOrder: (orderPayload: {
    studentName: string;
    studentPhone: string;
    deliveryArea: string;
    detailedAddress: string;
    paymentMethod: 'qr_bank' | 'qr_momo' | 'cash';
    studentNotes?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, staffNotes?: string) => Promise<void>;
  toggleDishStock: (dishId: string) => Promise<void>;
  addDish: (dish: Omit<Dish, 'id' | 'orderCount' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateDish: (dishId: string, dishData: Partial<Dish>) => Promise<void>;
  deleteDish: (dishId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  activeView: string;
  setActiveView: (view: string) => void;
  revenueStats: RevenueStats;
  unreadOrdersCount: number;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'foodzone_user_v2',
  AUTH: 'foodzone_auth_v2',
  DISHES: 'foodzone_dishes_v2',
  ORDERS: 'foodzone_orders_v2',
  REVIEWS: 'foodzone_reviews_v2',
  CART: 'foodzone_cart_v2',
};

export const CanteenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved !== null) return saved === 'true';
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEMO_USERS.student;
  });

  // Cloud status
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Dishes catalog
  const [dishes, setDishes] = useState<Dish[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISHES);
      if (saved) {
        const parsed: Dish[] = JSON.parse(saved);
        // Merge any new dishes from INITIAL_DISHES that might not be in cached localStorage
        const existingIds = new Set(parsed.map((d) => d.id));
        const missing = INITIAL_DISHES.filter((d) => !existingIds.has(d.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DISHES;
  });

  // Orders list
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  // Reviews list
  const [reviews, setReviews] = useState<DishReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Active view depending on user role
  const [activeView, setActiveView] = useState<string>(() => {
    if (currentUser.role === 'student') return 'menu';
    if (currentUser.role === 'staff') return 'kitchen';
    return 'analytics';
  });

  // Initialize and connect real-time Firestore database
  useEffect(() => {
    let unsubDishes: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubReviews: (() => void) | undefined;

    async function initFirestore() {
      try {
        await initializeDatabaseSeed();
        setIsCloudConnected(true);

        unsubDishes = subscribeToDishes((liveDishes) => {
          if (liveDishes && liveDishes.length > 0) {
            setDishes(liveDishes);
            localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(liveDishes));
          }
        });

        unsubOrders = subscribeToOrders((liveOrders) => {
          if (liveOrders) {
            setOrders(liveOrders);
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(liveOrders));
          }
        });

        unsubReviews = subscribeToReviews((liveReviews) => {
          if (liveReviews) {
            setReviews(liveReviews);
            localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(liveReviews));
          }
        });
      } catch (err) {
        console.error('Failed to connect to Firebase Firestore:', err);
      }
    }

    initFirestore();

    return () => {
      if (unsubDishes) unsubDishes();
      if (unsubOrders) unsubOrders();
      if (unsubReviews) unsubReviews();
    };
  }, []);

  // Sync state to localStorage for offline fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Login action
  const login = (role: Role, customUser?: User) => {
    const userToLogin = customUser || DEMO_USERS[role];
    setCurrentUser(userToLogin);
    setIsAuthenticated(true);
    if (role === 'student') {
      setActiveView('menu');
    } else if (role === 'staff') {
      setActiveView('kitchen');
    } else if (role === 'admin') {
      setActiveView('analytics');
    }
  };

  // Logout action
  const logout = () => {
    setIsAuthenticated(false);
    clearCart();
  };

  const switchActor = (role: Role, customUser?: User) => {
    login(role, customUser);
  };

  // Submit dish review by student
  const submitReview = async (reviewData: {
    orderId: string;
    dishId: string;
    dishName: string;
    rating: number;
    comment: string;
    tags?: string[];
  }) => {
    const newReview: DishReview = {
      id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: reviewData.orderId,
      dishId: reviewData.dishId,
      dishName: reviewData.dishName,
      studentId: currentUser.id,
      studentName: currentUser.name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
      tags: reviewData.tags || [],
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Save review to Firestore database
    try {
      await saveReviewToFirestore(newReview);
    } catch (e) {
      console.error('Error saving review to Firestore:', e);
    }

    // Recalculate average rating & review count for this dish
    const dishReviews = updatedReviews.filter((r) => r.dishId === reviewData.dishId);
    const totalRating = dishReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = dishReviews.length > 0 ? Number((totalRating / dishReviews.length).toFixed(1)) : reviewData.rating;

    setDishes((prev) =>
      prev.map((d) => {
        if (d.id === reviewData.dishId) {
          return {
            ...d,
            rating: avg,
            reviewCount: dishReviews.length,
          };
        }
        return d;
      })
    );

    // Update dish rating in Firestore
    try {
      await updateDishInFirestore(reviewData.dishId, {
        rating: avg,
        reviewCount: dishReviews.length,
      });
    } catch (e) {
      console.error('Error updating dish rating in Firestore:', e);
    }
  };

  // Admin reply to student review
  const replyToReview = async (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, adminReply: replyText } : r))
    );
    try {
      await updateReviewInFirestore(reviewId, { adminReply: replyText });
    } catch (e) {
      console.error('Error updating review reply in Firestore:', e);
    }
  };

  // Cart management
  const addToCart = (dish: Dish, quantity = 1, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      return [...prev, { dish, quantity, notes }];
    });
  };

  const updateCartQty = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.dish.id === dishId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order placement
  const placeOrder = async (orderPayload: {
    studentName: string;
    studentPhone: string;
    deliveryArea: string;
    detailedAddress: string;
    paymentMethod: 'qr_bank' | 'qr_momo' | 'cash';
    studentNotes?: string;
  }): Promise<Order> => {
    const orderItems = cart.map((item) => ({
      dishId: item.dish.id,
      dishName: item.dish.name,
      price: item.dish.price,
      quantity: item.quantity,
      img: item.dish.img,
      ...(item.notes ? { notes: item.notes } : {}),
    }));

    const totalAmount = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `FZ-${orderNum}`;

    const newOrder: Order = {
      id: orderId,
      studentId: currentUser.id,
      studentName: orderPayload.studentName || currentUser.name,
      studentPhone: orderPayload.studentPhone || currentUser.phone || '',
      deliveryArea: orderPayload.deliveryArea,
      detailedAddress: orderPayload.detailedAddress,
      items: orderItems,
      totalAmount,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod === 'cash' ? 'pending' : 'paid',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(orderPayload.studentNotes ? { studentNotes: orderPayload.studentNotes } : {}),
      estimatedMinutes: 10 + cart.length * 2,
      ...(orderPayload.paymentMethod === 'qr_bank' ? { qrRef: `VQR-${orderNum}` } : {}),
      ...(orderPayload.paymentMethod === 'qr_momo' ? { qrRef: `MOMO-${orderNum}` } : {}),
    };

    // Optimistically update local state
    setOrders((prev) => [newOrder, ...prev]);

    // Save to Firestore Database
    try {
      await saveOrderToFirestore(newOrder);
    } catch (e) {
      console.error('Error saving order to Firestore:', e);
    }

    // Update order counts for dishes
    const updatedDishes = dishes.map((dish) => {
      const orderedItem = orderItems.find((oi) => oi.dishId === dish.id);
      if (orderedItem) {
        const newCount = dish.orderCount + orderedItem.quantity;
        // background sync to firestore
        updateDishInFirestore(dish.id, { orderCount: newCount }).catch(console.error);
        return { ...dish, orderCount: newCount };
      }
      return dish;
    });
    setDishes(updatedDishes);

    clearCart();
    return newOrder;
  };

  // Update order status (by staff / kitchen)
  const updateOrderStatus = async (orderId: string, status: OrderStatus, staffNotes?: string) => {
    const updatedAt = new Date().toISOString();
    const existingOrder = orders.find((o) => o.id === orderId);
    const paymentStatus =
      status === 'completed' && existingOrder?.paymentMethod === 'cash'
        ? 'paid'
        : existingOrder?.paymentStatus || 'pending';

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: status,
            staffNotes: staffNotes !== undefined ? staffNotes : order.staffNotes,
            updatedAt,
            paymentStatus,
          };
        }
        return order;
      })
    );

    try {
      const updates: Partial<Order> = {
        orderStatus: status,
        updatedAt,
        paymentStatus,
      };
      if (staffNotes !== undefined) {
        updates.staffNotes = staffNotes;
      }
      await updateOrderStatusInFirestore(orderId, updates);
    } catch (e) {
      console.error('Error updating order status in Firestore:', e);
    }
  };

  // Cancel order (student or staff)
  const cancelOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'cancelled', 'Đã hủy đơn');
  };

  // Toggle dish inStock status
  const toggleDishStock = async (dishId: string) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return;
    const newStock = !dish.inStock;

    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, inStock: newStock } : d))
    );

    try {
      await updateDishInFirestore(dishId, { inStock: newStock });
    } catch (e) {
      console.error('Error updating dish inStock in Firestore:', e);
    }
  };

  // Add new dish (admin)
  const addDish = async (dishData: Omit<Dish, 'id' | 'orderCount' | 'rating' | 'reviewCount'>) => {
    const newDish: Dish = {
      ...dishData,
      id: `dish-${dishData.category}-${Date.now()}`,
      orderCount: 0,
      rating: 5.0,
      reviewCount: 0,
    };
    setDishes((prev) => [newDish, ...prev]);

    try {
      await saveDishToFirestore(newDish);
    } catch (e) {
      console.error('Error adding dish to Firestore:', e);
    }
  };

  // Update existing dish (admin)
  const updateDish = async (dishId: string, dishData: Partial<Dish>) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, ...dishData } : d))
    );

    try {
      await updateDishInFirestore(dishId, dishData);
    } catch (e) {
      console.error('Error updating dish in Firestore:', e);
    }
  };

  // Delete dish (admin)
  const deleteDish = async (dishId: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== dishId));

    try {
      await deleteDishFromFirestore(dishId);
    } catch (e) {
      console.error('Error deleting dish from Firestore:', e);
    }
  };

  // Number of pending orders for staff badge
  const unreadOrdersCount = useMemo(() => {
    return orders.filter((o) => o.orderStatus === 'pending').length;
  }, [orders]);

  // Compute Revenue Stats dynamically
  const revenueStats: RevenueStats = useMemo(() => {
    const nonCancelled = orders.filter((o) => o.orderStatus !== 'cancelled');
    const completed = orders.filter((o) => o.orderStatus === 'completed');
    const cancelled = orders.filter((o) => o.orderStatus === 'cancelled');

    const baseRevenue = 6450000;
    const currentOrdersRevenue = nonCancelled.reduce((sum, o) => sum + o.totalAmount, 0);
    const todayRevenue = baseRevenue + currentOrdersRevenue;

    const qrBankTotal = orders
      .filter((o) => o.paymentMethod === 'qr_bank' && o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const qrMomoTotal = orders
      .filter((o) => o.paymentMethod === 'qr_momo' && o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const cashTotal = orders
      .filter((o) => o.paymentMethod === 'cash' && o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Calculate top selling dishes
    const dishSalesMap: Record<string, { quantity: number; revenue: number; dish: Dish }> = {};

    dishes.forEach((d) => {
      dishSalesMap[d.id] = { quantity: d.orderCount, revenue: d.orderCount * d.price, dish: d };
    });

    const topDishes = Object.values(dishSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((item) => ({
        id: item.dish.id,
        name: item.dish.name,
        quantity: item.quantity,
        revenue: item.revenue,
        img: item.dish.img,
      }));

    const dailyRevenue = [
      { date: '2026-09-16', dayName: 'T4', revenue: 5200000, orderCount: 165 },
      { date: '2026-09-17', dayName: 'T5', revenue: 6400000, orderCount: 198 },
      { date: '2026-09-18', dayName: 'T6', revenue: 7850000, orderCount: 240 },
      { date: '2026-09-19', dayName: 'T7', revenue: 4900000, orderCount: 145 },
      { date: '2026-09-20', dayName: 'CN', revenue: 3800000, orderCount: 110 },
      { date: '2026-09-21', dayName: 'T2', revenue: 7100000, orderCount: 215 },
      { date: '2026-09-22', dayName: 'Hôm nay', revenue: todayRevenue, orderCount: 190 + nonCancelled.length },
    ];

    return {
      todayRevenue,
      todayOrderCount: 190 + orders.length,
      weekRevenue: 43250000 + currentOrdersRevenue,
      monthRevenue: 178500000 + currentOrdersRevenue,
      completedOrders: completed.length + 182,
      cancelledOrders: cancelled.length + 4,
      avgOrderValue: Math.round(todayRevenue / (190 + nonCancelled.length)),
      paymentStats: {
        qrBank: qrBankTotal + 3800000,
        qrMomo: qrMomoTotal + 1950000,
        cash: cashTotal + 700000,
      },
      dailyRevenue,
      topDishes,
    };
  }, [orders, dishes]);

  return (
    <CanteenContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isCloudConnected,
        login,
        logout,
        switchActor,
        dishes,
        orders,
        reviews,
        submitReview,
        replyToReview,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus,
        toggleDishStock,
        addDish,
        updateDish,
        deleteDish,
        cancelOrder,
        activeView,
        setActiveView,
        revenueStats,
        unreadOrdersCount,
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
