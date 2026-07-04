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
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        return [];
    }
}

function normalizeProduct(product, variant = {}) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number((variant.variant?.price || product.price) ?? 0),
        sale_price: Number((variant.variant?.sale_price || product.sale_price) ?? 0),
        image_url: product.image_url,
        stock: variant.variant?.stock || product.stock,
        category: product.category,
        rating: product.rating,
        reviews_count: product.reviews_count,
        selected_size: variant.size?.name || variant.size || product.selected_size,
        selected_color: variant.color?.name || variant.color || product.selected_color,
        selected_color_hex: variant.color?.hex_code || null,
        variant_id: variant.variant?.id || null,
        variant_key: variant.key || product.variant_key,
        variant_data: variant.variant || null,
    };
}

async function trackAnalytics(eventType, productId, metadata = {}) {
    try {
        await fetch('/api/storefront/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: eventType,
                product_id: productId,
                metadata,
            }),
        });
    } catch (error) {
        console.error('Failed to track analytics:', error);
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(readStoredCart);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = useCallback((product, quantity = 1, variant = {}) => {
        const amount = Math.max(1, Number(quantity) || 1);
        const safeProduct = normalizeProduct(product, variant);
        const lineKey = `${safeProduct.id}-${safeProduct.variant_id || 'default'}-${safeProduct.selected_size || 'default'}-${safeProduct.selected_color || 'default'}`;

        setItems((currentItems) => {
            const existing = currentItems.find((item) => item.lineKey === lineKey);

            if (existing) {
                return currentItems.map((item) =>
                    item.lineKey === lineKey
                        ? { ...item, quantity: item.quantity + amount }
                        : item,
                );
            }

            return [
                ...currentItems,
                {
                    id: `${lineKey}-${Date.now()}`,
                    lineKey,
                    product: safeProduct,
                    quantity: amount,
                },
            ];
        });
        
        // Track analytics
        trackAnalytics('add_to_cart', product.id, { quantity: amount, variant });
    }, []);

    const updateQuantity = useCallback((itemId, quantity) => {
        const amount = Math.max(1, Number(quantity) || 1);

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId || item.product.id === itemId ? { ...item, quantity: amount } : item,
            ),
        );
    }, []);

    const removeItem = useCallback((itemId) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== itemId && item.product.id !== itemId));
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
