// src/hooks/useLocalStorage.ts
// A custom React hook for persisting state to window.localStorage.

import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                const parsed = JSON.parse(item);
                // If initialValue is an object, merge it to ensure new keys exist
                if (typeof initialValue === 'object' && initialValue !== null && !Array.isArray(initialValue)) {
                    return { ...initialValue, ...parsed };
                }
                return parsed;
            }
            return initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
}
