import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [preferences, setPreferences] = useState({
        orderUpdates: true,
        promotions: false,
        wishlistAlerts: true,
        priceDrops: true,
        newsletter: false,
    });

    const updatePreference = useCallback((key, value) => {
        setPreferences((prev) => ({ ...prev, [key]: value }));
    }, []);

    const value = {
        preferences,
        updatePreference,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}
