import { createContext, useContext, useState, useCallback } from 'react';

const CurrencyContext = createContext(null);

const EXCHANGE_RATES = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.53,
    BDT: 110.00,
};

const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    BDT: '৳',
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');

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
