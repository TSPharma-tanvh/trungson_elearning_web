// src/utils/store-manager.ts

const StoreLocalManager = {
  saveLocalData: (key: string, value: unknown): void => {
    try {
      const str = typeof value === 'string' ? value : JSON.stringify(value);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, str);
      }
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  },

  getLocalData: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    } catch (err) {
      console.error('Failed to read from localStorage:', err);
      return null;
    }
  },

  removeLocalData: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.error('Failed to remove from localStorage:', err);
    }
  },

  clearAll: (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (err) {
      console.error('Failed to clear localStorage:', err);
    }
  },

  isValid(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  },

  saveIfValid(key: string, value: unknown): void {
    if (StoreLocalManager.isValid(value)) {
      StoreLocalManager.saveLocalData(key, (value as string).trim());
    }
  },
};

export default StoreLocalManager;
