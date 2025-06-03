
interface CacheConfig {
  name: string;
  maxAge: number;
  maxEntries: number;
}

class CacheManager {
  private caches: Map<string, CacheConfig> = new Map();

  constructor() {
    // Configure different cache strategies
    this.caches.set('exercises', {
      name: 'exercises-cache',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxEntries: 1000,
    });

    this.caches.set('images', {
      name: 'images-cache',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      maxEntries: 200,
    });

    this.caches.set('api-responses', {
      name: 'api-cache',
      maxAge: 5 * 60 * 1000, // 5 minutes
      maxEntries: 100,
    });
  }

  async get(cacheType: string, key: string): Promise<any> {
    const config = this.caches.get(cacheType);
    if (!config) return null;

    try {
      const cache = await caches.open(config.name);
      const response = await cache.match(key);
      
      if (!response) return null;

      const data = await response.json();
      const now = Date.now();
      
      // Check if cache is expired
      if (data.timestamp && (now - data.timestamp) > config.maxAge) {
        await cache.delete(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(cacheType: string, key: string, value: any): Promise<void> {
    const config = this.caches.get(cacheType);
    if (!config) return;

    try {
      const cache = await caches.open(config.name);
      const data = {
        value,
        timestamp: Date.now(),
      };

      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });

      await cache.put(key, response);
      await this.cleanup(cacheType);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(cacheType: string, key: string): Promise<void> {
    const config = this.caches.get(cacheType);
    if (!config) return;

    try {
      const cache = await caches.open(config.name);
      await cache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clear(cacheType: string): Promise<void> {
    const config = this.caches.get(cacheType);
    if (!config) return;

    try {
      await caches.delete(config.name);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  private async cleanup(cacheType: string): Promise<void> {
    const config = this.caches.get(cacheType);
    if (!config) return;

    try {
      const cache = await caches.open(config.name);
      const keys = await cache.keys();
      
      if (keys.length <= config.maxEntries) return;

      // Remove oldest entries
      const responses = await Promise.all(
        keys.map(async (key) => {
          const response = await cache.match(key);
          const data = response ? await response.json() : null;
          return { key, timestamp: data?.timestamp || 0 };
        })
      );

      responses.sort((a, b) => a.timestamp - b.timestamp);
      const toDelete = responses.slice(0, keys.length - config.maxEntries);

      await Promise.all(
        toDelete.map(item => cache.delete(item.key))
      );
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }
}

export const cacheManager = new CacheManager();
