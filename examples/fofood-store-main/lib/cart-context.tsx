"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { sdk, REGION_ID } from "./medusa";

const CART_KEY = "fofood_cart_id";

interface CartContextValue {
  cart: any | null;
  loading: boolean;
  itemCount: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function getCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_KEY);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureCart = useCallback(async (): Promise<any> => {
    const id = getCartId();
    if (id) {
      try {
        const { cart } = await sdk.store.cart.retrieve(id);
        if (cart && !cart.completed_at) return cart;
      } catch {
        /* fall through and create a new cart */
      }
    }
    const { cart } = await sdk.store.cart.create({ region_id: REGION_ID });
    localStorage.setItem(CART_KEY, cart.id);
    return cart;
  }, []);

  const refresh = useCallback(async () => {
    const id = getCartId();
    if (!id) {
      setCart(null);
      return;
    }
    try {
      const { cart } = await sdk.store.cart.retrieve(id);
      if (cart && !cart.completed_at) {
        setCart(cart);
      } else {
        setCart(null);
      }
    } catch {
      setCart(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      const current = await ensureCart();
      const { cart } = await sdk.store.cart.createLineItem(current.id, {
        variant_id: variantId,
        quantity,
      });
      setCart(cart);
    },
    [ensureCart]
  );

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    const id = getCartId();
    if (!id) return;
    const { cart } = await sdk.store.cart.updateLineItem(id, lineId, {
      quantity,
    });
    setCart(cart);
  }, []);

  const removeItem = useCallback(
    async (lineId: string) => {
      const id = getCartId();
      if (!id) return;
      await sdk.store.cart.deleteLineItem(id, lineId);
      await refresh();
    },
    [refresh]
  );

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_KEY);
    setCart(null);
  }, []);

  const itemCount = (cart?.items ?? []).reduce(
    (sum: number, item: any) => sum + (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        addItem,
        updateItem,
        removeItem,
        refresh,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
