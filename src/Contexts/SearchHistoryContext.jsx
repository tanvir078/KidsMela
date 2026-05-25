import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'progotix_search_history';

const SearchHistoryContext = createContext(null);

export const SearchHistoryProvider = ({ children }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }, [history]);

    const addToHistory = useCallback((query) => {
        if (!query || query.trim() === '') return;
        
        setHistory((prev) => {
            const filtered = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
            return [query, ...filtered].slice(0, 10);
        });
    }, []);

    const removeFromHistory = useCallback((query) => {
        setHistory((prev) => prev.filter((item) => item !== query));
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return (
        <SearchHistoryContext.Provider
            value={{
                history,
                addToHistory,
                removeFromHistory,
                clearHistory,
            }}
        >
            {children}
        </SearchHistoryContext.Provider>
    );
};

export const useSearchHistory = () => {
    const context = useContext(SearchHistoryContext);
    if (!context) {
        throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
    }
    return context;
};
