import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { GUEST_ID } from '@/context/AuthContext';
import { getProduct, unitPriceFor, type MilkName, type SizeName } from '@/data/menu';
import { db } from '@/services/firebase';

export const TAX_RATE = 0.05;
const storageKey = (userId: string) => `bnb:state:v3:${userId}`;

export type OrderType = 'Pickup' | 'Dine-in';

export type CartItem = {
  key: string;
  productId: string;
  size: SizeName;
  milk: MilkName;
  qty: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  createdAt: number;
  items: CartItem[];
  subtotal: number;
  discount?: number; // promo discount (older saved orders don't have it)
  promo?: string;
  note?: string; // special instructions typed by the customer
  tax: number;
  total: number;
  type: OrderType;
};

/** Promo codes. `min` = smallest subtotal (PKR) needed for the code to work. */
export const PROMOS: Record<string, { label: string; percent?: number; flat?: number; min: number }> = {
  BREW10: { label: '10% off your order', percent: 10, min: 0 },
  WELCOME50: { label: 'Rs 50 off orders above Rs 500', flat: 50, min: 500 },
  DESI15: { label: '15% off orders above Rs 800', percent: 15, min: 800 },
};

type StoreValue = {
  hydrated: boolean;
  resetAll: () => void;
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  promoCode: string | null;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  tax: number;
  total: number;
  favorites: string[];
  orders: Order[];
  addToCart: (productId: string, size: SizeName, milk: MilkName, qty: number) => void;
  changeQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  placeOrder: (type: OrderType, note?: string) => Order | null;
  reorder: (order: Order) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

/**
 * Cart and favorites are saved on the device (per user). Orders of a logged-in user are saved in
 * Cloud Firestore at users/{uid}/orders (write on checkout, read after login). Guest orders stay on the device.
 */
export function StoreProvider({ userId, children }: { userId: string | null; children: ReactNode }) {
  const [loaded, setHydrated] = useState(false);
  const hydrated = loaded || !userId;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const isGuest = userId === GUEST_ID;

  // Load this user's saved data (the provider is re-created with a new key when the user changes).
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey(userId));
        if (raw) {
          const data = JSON.parse(raw) as { cart?: CartItem[]; favorites?: string[]; orders?: Order[] };
          setCart(data.cart ?? []);
          setFavorites(data.favorites ?? []);
          if (userId === GUEST_ID) setOrders(data.orders ?? []);
        }
      } catch {
        // Corrupt or unavailable storage: start fresh.
      } finally {
        setHydrated(true);
      }
    })();
  }, [userId]);

  // Firestore read: load this user's past orders after login.
  useEffect(() => {
    if (!userId || userId === GUEST_ID) return;
    let cancelled = false;
    getDocs(collection(db, 'users', userId, 'orders'))
      .then((snap) => {
        if (cancelled) return;
        const cloud = snap.docs.map((d) => d.data() as Order);
        // Merge with any order placed while loading, newest first.
        setOrders((prev) => {
          const byId = new Map<string, Order>();
          [...cloud, ...prev].forEach((o) => byId.set(o.id, o));
          return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);
        });
      })
      .catch((e) => console.warn('Could not load orders from Firestore:', e));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Save whenever something changes (after the first load). Orders of real users live in Firestore.
  useEffect(() => {
    if (!hydrated || !userId) return;
    const data = isGuest ? { cart, favorites, orders } : { cart, favorites };
    AsyncStorage.setItem(storageKey(userId), JSON.stringify(data)).catch(() => {});
  }, [hydrated, userId, isGuest, cart, favorites, orders]);

  const addToCart = useCallback((productId: string, size: SizeName, milk: MilkName, qty: number) => {
    const product = getProduct(productId);
    if (!product) return;
    const key = `${productId}|${size}|${milk}`;
    const unitPrice = unitPriceFor(product, size, milk);
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { key, productId, size, milk, qty, unitPrice }];
    });
  }, []);

  const changeQty = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode(null);
  }, []);

  const resetAll = useCallback(() => {
    // Delete the user's orders from Firestore too, so they do not come back after the next login.
    if (userId && userId !== GUEST_ID) {
      getDocs(collection(db, 'users', userId, 'orders'))
        .then((snap) => Promise.all(snap.docs.map((d) => deleteDoc(d.ref))))
        .catch((e) => console.warn('Could not delete orders from Firestore:', e));
    }
    setCart([]);
    setPromoCode(null);
    setFavorites([]);
    setOrders([]);
  }, [userId]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const isFavorite = useCallback((productId: string) => favorites.includes(productId), [favorites]);

  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0), [cart]);
  // Discount is recalculated from the cart, so it disappears by itself if the cart gets too small.
  const discount = useMemo(() => {
    const promo = promoCode ? PROMOS[promoCode] : undefined;
    if (!promo || subtotal < promo.min) return 0;
    const raw = promo.percent ? Math.round((subtotal * promo.percent) / 100) : (promo.flat ?? 0);
    return Math.min(raw, subtotal);
  }, [promoCode, subtotal]);
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const total = subtotal - discount + tax;

  const applyPromo = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      const promo = PROMOS[code];
      if (!code) return { ok: false, message: 'Enter a promo code first.' };
      if (!promo) return { ok: false, message: 'This promo code is not valid.' };
      if (subtotal < promo.min) {
        return { ok: false, message: `${code} needs a subtotal of at least Rs ${promo.min}.` };
      }
      setPromoCode(code);
      return { ok: true, message: `${code} applied: ${promo.label}` };
    },
    [subtotal],
  );

  const removePromo = useCallback(() => setPromoCode(null), []);
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  const placeOrder = useCallback(
    (type: OrderType, note?: string): Order | null => {
      if (cart.length === 0) return null;
      const order: Order = {
        id: `BB-${Date.now().toString().slice(-6)}`,
        createdAt: Date.now(),
        items: cart,
        subtotal,
        discount: discount > 0 ? discount : undefined,
        promo: discount > 0 && promoCode ? promoCode : undefined,
        note: note?.trim() ? note.trim() : undefined,
        tax,
        total,
        type,
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      setPromoCode(null);
      // Firestore write: save the order in users/{uid}/orders/{orderId}.
      if (userId && userId !== GUEST_ID) {
        // JSON round trip removes undefined fields, which Firestore does not accept.
        const clean = JSON.parse(JSON.stringify(order)) as Order;
        setDoc(doc(db, 'users', userId, 'orders', order.id), clean).catch((e) =>
          console.warn('Could not save order to Firestore:', e),
        );
      }
      return order;
    },
    [cart, subtotal, discount, promoCode, tax, total, userId],
  );

  const reorder = useCallback((order: Order) => {
    setCart((prev) => {
      let next = [...prev];
      for (const item of order.items) {
        const existing = next.find((i) => i.key === item.key);
        next = existing
          ? next.map((i) => (i.key === item.key ? { ...i, qty: i.qty + item.qty } : i))
          : [...next, item];
      }
      return next;
    });
  }, []);

  const value: StoreValue = {
    hydrated,
    resetAll,
    cart,
    cartCount,
    subtotal,
    discount,
    promoCode,
    applyPromo,
    removePromo,
    tax,
    total,
    favorites,
    orders,
    addToCart,
    changeQty,
    removeItem,
    clearCart,
    toggleFavorite,
    isFavorite,
    placeOrder,
    reorder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
