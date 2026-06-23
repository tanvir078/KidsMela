import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'progotix_comparison';

const ComparisonContext = createContext(null);

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

export const ComparisonProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setCompareList(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product) => {
        if (compareList.length >= 3) {
            return false;
        }
        if (!compareList.some(item => item.id === product.id)) {
            setCompareList([...compareList, product]);
            // Track analytics
            trackAnalytics('comparison_add', product.id);
            return true;
        }
        return false;
    };

    const removeFromCompare = (productId) => {
        setCompareList(compareList.filter(item => item.id !== productId));
        // Track analytics
        trackAnalytics('remove_from_comparison', productId);
    };

    const isInCompare = (productId) => {
        return compareList.some(item => item.id === productId);
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    return (
        <ComparisonContext.Provider
            value={{
                compareList,
                addToCompare,
                removeFromCompare,
                isInCompare,
                clearCompare,
            }}
        >
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};
