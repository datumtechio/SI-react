import { useState, useEffect } from 'react';

export function useLocalStorage(key: string, initialValue: string) {
  // Get from local storage then parse stored value or return initialValue
  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item || initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this key in localStorage
  useEffect(() => {
    // Check for changes periodically
    const checkForChanges = () => {
      try {
        const item = window.localStorage.getItem(key);
        const currentValue = item || initialValue;
        if (currentValue !== storedValue) {
          setStoredValue(currentValue);
        }
      } catch (error) {
        console.error(`Error checking localStorage key "${key}":`, error);
      }
    };

    // Check for changes every 200ms
    const interval = setInterval(checkForChanges, 200);

    return () => {
      clearInterval(interval);
    };
  }, [key, initialValue, storedValue]);

  return [storedValue, setValue] as const;
}