import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export interface CacheEntry {
  cacheKey: string;
  type: 'prompt' | 'response' | 'search' | 'embedding';
  value: any;
  expiresAt: Date;
  createdAt: Date;
}

const IN_MEMORY_CACHE = new Map<string, { value: any; expiresAt: number }>();

export class CacheLayer {
  /**
   * Generates a unique cache key based on query and context parameters.
   */
  public static generateKey(type: string, input: any): string {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
    return `${type}_${hash}`;
  }

  /**
   * Retrieves a cached value. Checks memory, then MongoDB.
   */
  public static async get(cacheKey: string): Promise<any | null> {
    const now = Date.now();

    // 1. Try In-Memory Cache
    const memCached = IN_MEMORY_CACHE.get(cacheKey);
    if (memCached) {
      if (memCached.expiresAt > now) {
        console.log(`[CacheLayer] Memory Hit: "${cacheKey}"`);
        return memCached.value;
      } else {
        IN_MEMORY_CACHE.delete(cacheKey);
      }
    }

    // 2. Try MongoDB Cache
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      const entry = await db.collection('gateway_caches').findOne({ cacheKey });
      if (entry) {
        const expiresAt = new Date(entry.expiresAt).getTime();
        if (expiresAt > now) {
          console.log(`[CacheLayer] MongoDB Hit: "${cacheKey}"`);
          // Store back in memory
          IN_MEMORY_CACHE.set(cacheKey, { value: entry.value, expiresAt });
          return entry.value;
        } else {
          // Delete expired entry async
          db.collection('gateway_caches').deleteOne({ cacheKey }).catch(() => {});
        }
      }
    } catch (e) {
      // Quiet fail
    }

    return null;
  }

  /**
   * Saves a value to cache. Updates memory and MongoDB.
   * TTL (time to live) defaults to 1 hour (3600 seconds) for general items.
   */
  public static async set(
    cacheKey: string,
    type: CacheEntry['type'],
    value: any,
    ttlSeconds = 3600
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    // 1. Update In-Memory Cache
    IN_MEMORY_CACHE.set(cacheKey, {
      value,
      expiresAt: expiresAt.getTime()
    });

    // 2. Update MongoDB Cache
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      
      // Ensure expiresAt index exists on MongoDB to auto-expire documents
      await db.collection('gateway_caches').createIndex(
        { expiresAt: 1 }, 
        { expireAfterSeconds: 0 }
      ).catch(() => {});

      await db.collection('gateway_caches').updateOne(
        { cacheKey },
        {
          $set: {
            cacheKey,
            type,
            value,
            expiresAt,
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
    } catch (e) {
      console.warn('[CacheLayer] Failed to write cache to MongoDB:', e);
    }
  }

  /**
   * Clears the entire cache or specific cache type.
   */
  public static async purge(type?: CacheEntry['type']): Promise<void> {
    // Clear In-Memory
    if (type) {
      for (const [key] of IN_MEMORY_CACHE.entries()) {
        if (key.startsWith(`${type}_`)) {
          IN_MEMORY_CACHE.delete(key);
        }
      }
    } else {
      IN_MEMORY_CACHE.clear();
    }

    // Clear MongoDB
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      if (type) {
        await db.collection('gateway_caches').deleteMany({ type });
      } else {
        await db.collection('gateway_caches').deleteMany({});
      }
      console.log(`[CacheLayer] Caches purged ${type ? `for type "${type}"` : 'completely'}`);
    } catch (e) {
      console.error('[CacheLayer] Purge failed on MongoDB:', e);
    }
  }
}
