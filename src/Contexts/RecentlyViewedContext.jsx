import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RecentlyViewedContext = createContext(null);
const STORAGE_KEY = 'progotix_recently_viewed';
const MAX_ITEMS = 10;

function readStoredItems() {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return value ? JSON.parse(value) : [];
    } catch {
        return [];
    }
}

function normalizeProduct(product) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price ?? 0),
        image_url: product.image_url,
        stock: product.stock,
        category: product.category,
        rating: product.rating,
        reviews_count: product.reviews_count,
    };
}

export function RecentlyViewedProvider({ children }) {
    const [items, setItems] = useState(readStoredItems);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = useCallback((product) => {
        const safeProduct = normalizeProduct(product);

        setItems((currentItems) => {
            const filtered = currentItems.filter((item) => item.id !== safeProduct.id);
            return [safeProduct, ...filtered].slice(0, MAX_ITEMS);
        });
    }, []);

    const clearItems = useCallback(() => {
        setItems([]);
    }, []);

    const value = useMemo(() => ({
        items,
        addItem,
        clearItems,
    }), [addItem, clearItems, items]);

    return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext);

    if (!context) {
        throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
    }

    return context;
}
