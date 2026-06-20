"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const FAVORITES_KEY = "fofood_favorites";

export interface FavoriteItem {
  id: string;
  variantId: string;
  handle: string;
  name: string;
  image: string;
  price: string;
}

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  isFavorite: (id: string) => boolean;
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY) || "[]";
      setFavorites(JSON.parse(raw));
    } catch {
      setFavorites([]);
    }
  }, []);

  const persist = useCallback((next: FavoriteItem[]) => {
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggle = useCallback(
    (item: FavoriteItem) => {
      const exists = favorites.some((f) => f.id === item.id);
      persist(
        exists ? favorites.filter((f) => f.id !== item.id) : [...favorites, item]
      );
    },
    [favorites, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(favorites.filter((f) => f.id !== id));
    },
    [favorites, persist]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggle, remove }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
