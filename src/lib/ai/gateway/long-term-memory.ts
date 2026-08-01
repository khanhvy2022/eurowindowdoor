/**
 * Mem0 Long-Term User & Entity Memory Service.
 * Manages persistent user preferences, project specifications (door dimensions, materials, budget),
 * and customer profile graph across multiple chat sessions.
 */

export interface UserMemoryFact {
  id: string;
  memory: string;
  category: 'preference' | 'dimension' | 'budget' | 'project_detail' | 'general';
  confidence: number;
  createdAt: string;
}

export class LongTermMemoryManager {
  private static instance: LongTermMemoryManager;

  private constructor() {}

  public static getInstance(): LongTermMemoryManager {
    if (!LongTermMemoryManager.instance) {
      LongTermMemoryManager.instance = new LongTermMemoryManager();
    }
    return LongTermMemoryManager.instance;
  }

  private isEnabled(): boolean {
    return process.env.ENABLE_LONGTERM_MEMORY === 'true';
  }

  private getMem0ApiKey(): string | undefined {
    return process.env.MEM0_API_KEY;
  }

  /**
   * Fetches relevant user long-term facts for a given userId / sessionId.
   */
  public async getUserMemories(userId: string, query?: string): Promise<UserMemoryFact[]> {
    if (!this.isEnabled()) return [];

    const apiKey = this.getMem0ApiKey();
    if (!apiKey) return [];

    try {
      const response = await fetch('https://api.mem0.ai/v1/memories/search/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          query: query || 'window door specification budget preference',
          limit: 5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          return data.map((item: any) => ({
            id: item.id || `mem-${Math.random()}`,
            memory: item.memory || item.text || '',
            category: item.metadata?.category || 'general',
            confidence: item.score || 0.9,
            createdAt: item.created_at || new Date().toISOString(),
          }));
        }
      }
    } catch (err) {
      console.warn('[Mem0 LongTermMemory] Error querying memories:', err);
    }

    return [];
  }

  /**
   * Adds new conversation messages to extract and update user memory profile.
   */
  public async addMemory(
    userId: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<boolean> {
    if (!this.isEnabled()) return false;

    const apiKey = this.getMem0ApiKey();
    if (!apiKey) return false;

    try {
      const response = await fetch('https://api.mem0.ai/v1/memories/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          messages,
        }),
      });

      return response.ok;
    } catch (err) {
      console.warn('[Mem0 LongTermMemory] Error adding memory:', err);
      return false;
    }
  }
}

export const longTermMemory = LongTermMemoryManager.getInstance();
