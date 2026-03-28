import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'flipkart-recently-visited';
const MAX_ITEMS = 12;

export function addRecentlyVisited(product) {
  if (!product?.id) return;

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Remove if already exists
    const filtered = stored.filter((p) => p.id !== product.id);
    // Add to front
    const updated = [
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        mrp: product.mrp,
        rating: product.rating,
        reviewCount: product.reviewCount,
        images: product.images?.slice(0, 1) || [],
        visitedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function getRecentlyVisited() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useRecentlyVisited() {
  const [products, setProducts] = useState(() => getRecentlyVisited());

  const refresh = useCallback(() => {
    setProducts(getRecentlyVisited());
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        refresh();
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [refresh]);

  return { products, refresh };
}
