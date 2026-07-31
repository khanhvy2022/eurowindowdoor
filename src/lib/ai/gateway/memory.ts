import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export interface SessionMemory {
  sessionId: string;
  context: Record<string, any>;
  summary?: string;
  tokenUsage: { prompt: number; completion: number; total: number };
  lastState?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory cache for fast session lookup with TTL
const IN_MEMORY_SESSION_CACHE = new Map<string, { data: SessionMemory; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

export class MemoryManager {
  /**
   * Loads session memory from database or cache.
   */
  public static async getSession(sessionId: string): Promise<SessionMemory> {
    const now = Date.now();
    const cached = IN_MEMORY_SESSION_CACHE.get(sessionId);

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    let sessionData: SessionMemory | null = null;

    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      const doc = await db.collection('conversation_memories').findOne({ sessionId });
      if (doc) {
        sessionData = doc as unknown as SessionMemory;
      }
    } catch (e) {
      console.warn('[MemoryManager] Failed to fetch session from MongoDB, using cache/defaults:', e);
    }

    if (!sessionData) {
      sessionData = {
        sessionId,
        context: {},
        tokenUsage: { prompt: 0, completion: 0, total: 0 },
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // Update Cache
    IN_MEMORY_SESSION_CACHE.set(sessionId, {
      data: sessionData,
      expiresAt: now + CACHE_TTL_MS
    });

    return sessionData;
  }

  /**
   * Saves/Updates session memory.
   */
  public static async saveSession(sessionId: string, updates: Partial<SessionMemory>): Promise<void> {
    const session = await this.getSession(sessionId);

    const updatedSession: SessionMemory = {
      ...session,
      ...updates,
      context: { ...session.context, ...(updates.context || {}) },
      tokenUsage: {
        prompt: session.tokenUsage.prompt + (updates.tokenUsage?.prompt || 0),
        completion: session.tokenUsage.completion + (updates.tokenUsage?.completion || 0),
        total: session.tokenUsage.total + (updates.tokenUsage?.total || 0),
      },
      updatedAt: new Date()
    };

    // Update cache
    IN_MEMORY_SESSION_CACHE.set(sessionId, {
      data: updatedSession,
      expiresAt: Date.now() + CACHE_TTL_MS
    });

    // Save to MongoDB
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      await db.collection('conversation_memories').updateOne(
        { sessionId },
        { $set: updatedSession },
        { upsert: true }
      );
    } catch (e) {
      console.error('[MemoryManager] Failed to write session to MongoDB:', e);
    }
  }

  /**
   * Clear cache for a specific session.
   */
  public static clearCache(sessionId: string) {
    IN_MEMORY_SESSION_CACHE.delete(sessionId);
  }
}
