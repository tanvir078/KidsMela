import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'progotix_guest_cart';

function readStoredCart() {
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

export function CartProvider({ children }) {
    const [items, setItems] = useState(readStoredCart);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = useCallback((product, quantity = 1) => {
        const amount = Math.max(1, Number(quantity) || 1);
        const safeProduct = normalizeProduct(product);

        setItems((currentItems) => {
            const existing = currentItems.find((item) => item.product.id === safeProduct.id);

            if (existing) {
                return currentItems.map((item) =>
                    item.product.id === safeProduct.id
                        ? { ...item, quantity: item.quantity + amount }
                        : item,
                );
            }

            return [
                ...currentItems,
                {
                    id: `${safeProduct.id}-${Date.now()}`,
                    product: safeProduct,
                    quantity: amount,
                },
            ];
        });
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        const amount = Math.max(1, Number(quantity) || 1);

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product.id === productId ? { ...item, quantity: amount } : item,
            ),
        );
    }, []);

    const removeItem = useCallback((productId) => {
        setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const value = useMemo(() => {
        const itemCount = items.reduce((total, item) => total + item.quantity, 0);
        const subtotal = items.reduce(
            (total, item) => total + Number(item.product.price ?? 0) * item.quantity,
            0,
        );

        return {
            items,
            itemCount,
            subtotal,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
        };
    }, [addItem, clearCart, items, removeItem, updateQuantity]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }

    return context;
}
