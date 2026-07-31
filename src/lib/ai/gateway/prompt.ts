import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export interface PromptTemplate {
  key: string;
  name: string;
  template: string;
  version: number;
  tags: string[];
  description?: string;
  updatedAt: Date;
}

const DEFAULT_TEMPLATES: Record<string, PromptTemplate> = {
  product_consulting: {
    key: 'product_consulting',
    name: 'Eurowindow Door Consulting Prompt',
    version: 1,
    tags: ['consulting', 'rag'],
    template: `Bạn là chuyên gia tư vấn cửa Eurowindow cao cấp. 
Nhiệm vụ của bạn là tư vấn cho khách hàng về các dòng sản phẩm cửa của Eurowindow như cửa nhôm, cửa nhựa uPVC, cửa gỗ, vách kính lớn, và các phụ kiện đi kèm.

Hãy tuân thủ nghiêm ngặt các quy tắc:
1. Giao tiếp chuyên nghiệp, lịch sự, tôn trọng khách hàng.
2. Trả lời ngắn gọn, đúng trọng tâm, tuyệt đối KHÔNG giả định hay tự bịa đặt thông tin.
3. Đối chiếu chính xác thông số kỹ thuật từ tài liệu của công ty.
4. Nếu thông tin không có trong tài liệu, đề xuất khách hàng để lại số điện thoại/email để kỹ thuật liên hệ hỗ trợ.`,
    updatedAt: new Date(),
  },
  house_design: {
    key: 'house_design',
    name: 'Architectural Spec Extraction Prompt',
    version: 1,
    tags: ['ai-designer', 'spec'],
    template: `You are an architectural spec extraction assistant for Eurowindow. 
Analyze the user's prompt (width={width}mm, height={height}mm) and extract the building layout specifications as a clean JSON matching:
{
  "style": "modern" | "classic" | "suburban",
  "floors": number,
  "rooms": string[],
  "dimensions": { "width": number, "length": number }
}`,
    updatedAt: new Date(),
  },
  pricing: {
    key: 'pricing',
    name: 'Cost Calculation Prompt',
    version: 1,
    tags: ['pricing', 'bom'],
    template: `Bạn là trợ lý tính toán báo giá cửa Eurowindow.
Dựa vào diện tích sổ (m2) và phụ kiện đi kèm, tính tổng đơn giá cửa cơ bản và kính phụ trội.
Cách tính: Thành tiền = Diện tích * (Đơn giá cửa + Đơn giá kính + Đơn giá phụ kiện).
Đơn giá nhôm EA55 khoảng 5.000.000 VNĐ/m2. Hệ nhôm cách nhiệt EA60i khoảng 7.500.000 VNĐ/m2. Cửa nhựa Kommerling khoảng 6.000.000 VNĐ/m2.
Xuất kết quả chi tiết từng bộ và tổng giá trị gói sản phẩm.`,
    updatedAt: new Date(),
  }
};

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'prompt_templates.json');

export class PromptManager {
  /**
   * Initializes prompt templates database/local storage.
   */
  public static async init() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(LOCAL_DATA_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (!fs.existsSync(LOCAL_DATA_FILE)) {
        fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(Object.values(DEFAULT_TEMPLATES), null, 2), 'utf-8');
      }
    } catch (err) {
      console.warn('[PromptManager] Failed to initialize local storage (likely read-only filesystem):', err);
    }
  }

  /**
   * Loads template by key, checking MongoDB, local file, or defaults.
   */
  public static async getTemplate(key: string): Promise<PromptTemplate> {
    await this.init();

    // 1. Try MongoDB
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      const template = await db.collection('prompt_templates').findOne({ key });
      if (template) return template as unknown as PromptTemplate;
    } catch (e) {
      // Quiet fail to local storage
    }

    // 2. Try Local file
    try {
      if (fs.existsSync(LOCAL_DATA_FILE)) {
        const templates = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf-8')) as PromptTemplate[];
        const match = templates.find(t => t.key === key);
        if (match) return match;
      }
    } catch (e) {
      // Quiet fail to default
    }

    // 3. Fallback to default
    return DEFAULT_TEMPLATES[key] || {
      key,
      name: `Default ${key}`,
      template: `Bạn là trợ lý AI của Eurowindow. Hãy hỗ trợ người dùng với ý định ${key}.`,
      version: 1,
      tags: ['default'],
      updatedAt: new Date()
    };
  }

  /**
   * Updates or inserts a prompt template.
   */
  public static async saveTemplate(template: Omit<PromptTemplate, 'updatedAt'>): Promise<void> {
    await this.init();
    const updated: PromptTemplate = {
      ...template,
      updatedAt: new Date()
    };

    // 1. Update MongoDB
    let mongoSuccess = false;
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      await db.collection('prompt_templates').updateOne(
        { key: updated.key },
        { $set: updated },
        { upsert: true }
      );
      mongoSuccess = true;
    } catch (e) {
      console.warn('[PromptManager] Failed to save template to MongoDB, falling back to local file:', e);
    }

    // 2. Update Local file
    try {
      let list: PromptTemplate[] = [];
      if (fs.existsSync(LOCAL_DATA_FILE)) {
        list = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf-8'));
      }
      const idx = list.findIndex(t => t.key === updated.key);
      if (idx !== -1) {
        list[idx] = updated;
      } else {
        list.push(updated);
      }
      fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error('[PromptManager] Local save failed:', err);
    }
  }

  /**
   * Returns all prompt templates.
   */
  public static async getAllTemplates(): Promise<PromptTemplate[]> {
    await this.init();
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      const list = await db.collection('prompt_templates').find({}).toArray();
      if (list && list.length > 0) return list as unknown as PromptTemplate[];
    } catch (e) {
      // Fail over to local file
    }

    try {
      if (fs.existsSync(LOCAL_DATA_FILE)) {
        return JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf-8'));
      }
    } catch (e) {}

    return Object.values(DEFAULT_TEMPLATES);
  }

  /**
   * Resolves prompt variables.
   */
  public static interpolate(template: string, variables: Record<string, any>): string {
    let result = template;
    for (const [key, val] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), String(val));
    }
    return result;
  }
}
