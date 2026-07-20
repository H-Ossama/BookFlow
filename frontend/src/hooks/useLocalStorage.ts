import { useState } from 'react';
export function useLocalStorage<T>(_key: string, initialValue: T) {
  // TODO: Local storage implementation
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  return [storedValue, setStoredValue] as const;
}
