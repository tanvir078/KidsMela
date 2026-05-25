import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'progotix_wishlist';

function readStoredWishlist() {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
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

export function WishlistProvider({ children }) {
    const [items, setItems] = useState(readStoredWishlist);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const isSaved = useCallback(
        (productId) => items.some((item) => item.id === productId),
        [items],
    );

    const addItem = useCallback((product) => {
        const safeProduct = normalizeProduct(product);

        setItems((currentItems) =>
            currentItems.some((item) => item.id === safeProduct.id)
                ? currentItems
                : [safeProduct, ...currentItems],
        );
    }, []);

    const removeItem = useCallback((productId) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    }, []);

    const toggleItem = useCallback(
        (product) => {
            if (isSaved(product.id)) {
                removeItem(product.id);
                return;
            }

            addItem(product);
        },
        [addItem, isSaved, removeItem],
    );

    const value = useMemo(
        () => ({
            items,
            count: items.length,
            isSaved,
            addItem,
            removeItem,
            toggleItem,
        }),
        [addItem, isSaved, items, removeItem, toggleItem],
    );

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }

    return context;
}
