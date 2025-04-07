export class StorageManager {
  private static instance: StorageManager;
  private readonly PREFIX = 'drivechain_';

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private getKey(key: string): string {
    return `${this.PREFIX}${key}`;
  }

  public setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  public clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Session specific methods
  public setSessionItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  public getSessionItem<T>(key: string, defaultValue: T): T {
    try {
      const item = sessionStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  }

  public removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }

  public clearSession(): void {
    try {
      Object.keys(sessionStorage)
        .filter(key => key.startsWith(this.PREFIX))
        .forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  // Cache specific methods
  private async getCache(): Promise<Cache> {
    return await caches.open(`${this.PREFIX}cache`);
  }

  public async cacheData(key: string, data: any): Promise<void> {
    try {
      const cache = await this.getCache();
      const response = new Response(JSON.stringify(data));
      await cache.put(this.getKey(key), response);
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  public async getCachedData<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const cache = await this.getCache();
      const response = await cache.match(this.getKey(key));
      if (!response) return defaultValue;
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Error reading cached data:', error);
      return defaultValue;
    }
  }

  public async clearCache(): Promise<void> {
    try {
      await caches.delete(`${this.PREFIX}cache`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
} 