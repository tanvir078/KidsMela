import { createContext, useContext, useState, useCallback } from 'react';

const CurrencyContext = createContext(null);

const EXCHANGE_RATES = {
    BDT: 1,
};

const CURRENCY_SYMBOLS = {
    BDT: '৳',
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrencyState] = useState(() => {
        if (typeof window !== 'undefined') {
            // Clear any old currency and force BDT
            localStorage.removeItem('progotix_currency');
        }
        return 'BDT';
    });

    const setCurrency = useCallback((code) => {
        setCurrencyState(code);
        if (typeof window !== 'undefined') {
            localStorage.setItem('progotix_currency', code);
        }
    }, []);

    const formatMoney = useCallback((value) => {
        const converted = value * EXCHANGE_RATES[currency];
        const symbol = CURRENCY_SYMBOLS[currency];
        return `${symbol}${Number(converted ?? 0).toFixed(2)}`;
    }, [currency]);

    const convertValue = useCallback((value) => {
        return value * EXCHANGE_RATES[currency];
    }, [currency]);

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                formatMoney,
                convertValue,
                availableCurrencies: Object.keys(EXCHANGE_RATES),
                currencySymbols: CURRENCY_SYMBOLS,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
