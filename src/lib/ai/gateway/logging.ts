import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export interface GatewayLog {
  id: string;
  sessionId: string;
  intent: string;
  query: string;
  model: string;
  provider: string;
  durationMs: number;
  tokens: { prompt: number; completion: number; total: number };
  toolsUsed: string[];
  citations: string[];
  cacheHit: boolean;
  error?: string;
  createdAt: Date;
}

const LOGS_FILE = path.join(process.cwd(), 'data', 'gateway_logs.json');

export class GatewayLogger {
  /**
   * Logs a gateway interaction to MongoDB and a local file backup.
   */
  public static async log(entry: Omit<GatewayLog, 'id' | 'createdAt'>): Promise<void> {
    const uuid = require('uuid');
    const logEntry: GatewayLog = {
      ...entry,
      id: uuid.v4(),
      createdAt: new Date()
    };

    console.log(`[GatewayLogger] Logged: Intent="${logEntry.intent}", Model="${logEntry.model}", Duration=${logEntry.durationMs}ms, CacheHit=${logEntry.cacheHit}`);

    // 1. Write to MongoDB
    let mongoSuccess = false;
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      await db.collection('gateway_logs').insertOne(logEntry);
      mongoSuccess = true;
    } catch (e) {
      console.warn('[GatewayLogger] Failed to write log to MongoDB, backing up locally:', e);
    }

    // 2. Write to Local File
    try {
      const dataDir = path.dirname(LOGS_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      let logs: GatewayLog[] = [];
      if (fs.existsSync(LOGS_FILE)) {
        try {
          logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
        } catch {
          // File corrupted
        }
      }
      
      logs.push(logEntry);
      // Limit local log backup to last 200 items to avoid infinite size growth
      if (logs.length > 200) {
        logs = logs.slice(logs.length - 200);
      }
      
      fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (err) {
      console.error('[GatewayLogger] Local write failed:', err);
    }
  }

  /**
   * Reads the latest gateway logs.
   */
  public static async getLatestLogs(limit = 50): Promise<GatewayLog[]> {
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      const docs = await db.collection('gateway_logs')
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      if (docs && docs.length > 0) return docs as unknown as GatewayLog[];
    } catch (e) {
      // Failover to local file
    }

    try {
      if (fs.existsSync(LOGS_FILE)) {
        const logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8')) as GatewayLog[];
        return logs.reverse().slice(0, limit);
      }
    } catch (e) {}

    return [];
  }

  /**
   * Retrieves summary monitoring stats.
   */
  public static async getStats(): Promise<any> {
    const defaultStats = {
      totalRequests: 0,
      cacheHitRate: 0,
      avgDurationMs: 0,
      errorRate: 0,
      intentDistribution: {} as Record<string, number>,
      tokensUsed: 0
    };

    let logs: GatewayLog[] = [];

    // 1. Try fetching from MongoDB
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      const docs = await db.collection('gateway_logs').find({}).toArray();
      if (docs && docs.length > 0) {
        logs = docs as unknown as GatewayLog[];
      }
    } catch (e) {
      // Fallback
    }

    // 2. Try fetching from local file
    if (logs.length === 0) {
      try {
        if (fs.existsSync(LOGS_FILE)) {
          logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
        }
      } catch (e) {}
    }

    if (logs.length === 0) return defaultStats;

    let cacheHits = 0;
    let totalDuration = 0;
    let errorsCount = 0;
    let totalTokens = 0;
    const distribution: Record<string, number> = {};

    logs.forEach(log => {
      if (log.cacheHit) cacheHits++;
      totalDuration += log.durationMs;
      if (log.error) errorsCount++;
      totalTokens += log.tokens?.total || 0;
      distribution[log.intent] = (distribution[log.intent] || 0) + 1;
    });

    return {
      totalRequests: logs.length,
      cacheHitRate: Math.round((cacheHits / logs.length) * 100),
      avgDurationMs: Math.round(totalDuration / logs.length),
      errorRate: Math.round((errorsCount / logs.length) * 100),
      intentDistribution: distribution,
      tokensUsed: totalTokens
    };
  }
}
