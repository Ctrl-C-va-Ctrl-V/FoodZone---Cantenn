import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Dish, Order, DishReview } from '../types';
import { INITIAL_DISHES, INITIAL_ORDERS, INITIAL_REVIEWS } from '../data/initialData';

const COLLECTIONS = {
  DISHES: 'dishes',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  SETTINGS: 'settings',
};

// Seed initial collections or sync missing dishes to Firestore
export async function initializeDatabaseSeed(): Promise<void> {
  try {
    const dishesSnap = await getDocs(collection(db, COLLECTIONS.DISHES));
    if (dishesSnap.empty) {
      console.log('Seeding initial dishes to Firestore...');
      const batch = writeBatch(db);
      INITIAL_DISHES.forEach((dish: Dish) => {
        const dishRef = doc(db, COLLECTIONS.DISHES, dish.id);
        batch.set(dishRef, sanitizeForFirestore(dish));
      });
      await batch.commit();
    } else {
      // If collection exists, ensure newly added standard dishes are also synced
      const existingIds = new Set(dishesSnap.docs.map((d) => d.id));
      const missingDishes = INITIAL_DISHES.filter((d) => !existingIds.has(d.id));
      if (missingDishes.length > 0) {
        console.log(`Syncing ${missingDishes.length} new dishes to Firestore...`);
        const batch = writeBatch(db);
        missingDishes.forEach((dish: Dish) => {
          const dishRef = doc(db, COLLECTIONS.DISHES, dish.id);
          batch.set(dishRef, sanitizeForFirestore(dish));
        });
        await batch.commit();
      }
    }

    const ordersSnap = await getDocs(collection(db, COLLECTIONS.ORDERS));
    if (ordersSnap.empty) {
      console.log('Seeding initial orders to Firestore...');
      const batch = writeBatch(db);
      INITIAL_ORDERS.forEach((order: Order) => {
        const orderRef = doc(db, COLLECTIONS.ORDERS, order.id);
        batch.set(orderRef, order);
      });
      await batch.commit();
    }

    const reviewsSnap = await getDocs(collection(db, COLLECTIONS.REVIEWS));
    if (reviewsSnap.empty) {
      console.log('Seeding initial reviews to Firestore...');
      const batch = writeBatch(db);
      INITIAL_REVIEWS.forEach((rev: DishReview) => {
        const revRef = doc(db, COLLECTIONS.REVIEWS, rev.id);
        batch.set(revRef, rev);
      });
      await batch.commit();
    }
  } catch (err) {
    console.error('Error during Firestore initial seed:', err);
  }
}

// Subscribe to Dishes collection
export function subscribeToDishes(callback: (dishes: Dish[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.DISHES),
    (snapshot) => {
      if (!snapshot.empty) {
        const dishes = snapshot.docs.map((doc) => doc.data() as Dish);
        callback(dishes);
      }
    },
    (err) => {
      console.error('Firestore dishes listener error:', err);
    }
  );
}

// Subscribe to Orders collection
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.ORDERS),
    (snapshot) => {
      if (!snapshot.empty) {
        const orders = snapshot.docs.map((doc) => doc.data() as Order);
        // sort by newest
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(orders);
      }
    },
    (err) => {
      console.error('Firestore orders listener error:', err);
    }
  );
}

// Subscribe to Reviews collection
export function subscribeToReviews(callback: (reviews: DishReview[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.REVIEWS),
    (snapshot) => {
      if (!snapshot.empty) {
        const reviews = snapshot.docs.map((doc) => doc.data() as DishReview);
        reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(reviews);
      }
    },
    (err) => {
      console.error('Firestore reviews listener error:', err);
    }
  );
}

// Helper function to recursively remove undefined values which Firestore rejects
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleanObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeForFirestore(value);
      }
    }
    return cleanObj as T;
  }
  return data;
}

// Create or update order in Firestore
export async function saveOrderToFirestore(order: Order): Promise<void> {
  const orderRef = doc(db, COLLECTIONS.ORDERS, order.id);
  const cleanOrder = sanitizeForFirestore(order);
  await setDoc(orderRef, cleanOrder);
}

// Update order status in Firestore
export async function updateOrderStatusInFirestore(
  orderId: string,
  updates: Partial<Order>
): Promise<void> {
  const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
  const cleanUpdates = sanitizeForFirestore(updates);
  await updateDoc(orderRef, cleanUpdates);
}

// Save new review in Firestore
export async function saveReviewToFirestore(review: DishReview): Promise<void> {
  const reviewRef = doc(db, COLLECTIONS.REVIEWS, review.id);
  const cleanReview = sanitizeForFirestore(review);
  await setDoc(reviewRef, cleanReview);
}

// Update review (e.g. admin reply)
export async function updateReviewInFirestore(
  reviewId: string,
  updates: Partial<DishReview>
): Promise<void> {
  const reviewRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
  const cleanUpdates = sanitizeForFirestore(updates);
  await updateDoc(reviewRef, cleanUpdates);
}

// Dish management
export async function saveDishToFirestore(dish: Dish): Promise<void> {
  const dishRef = doc(db, COLLECTIONS.DISHES, dish.id);
  const cleanDish = sanitizeForFirestore(dish);
  await setDoc(dishRef, cleanDish);
}

export async function updateDishInFirestore(dishId: string, updates: Partial<Dish>): Promise<void> {
  const dishRef = doc(db, COLLECTIONS.DISHES, dishId);
  const cleanUpdates = sanitizeForFirestore(updates);
  await updateDoc(dishRef, cleanUpdates);
}

export async function deleteDishFromFirestore(dishId: string): Promise<void> {
  const dishRef = doc(db, COLLECTIONS.DISHES, dishId);
  await deleteDoc(dishRef);
}
