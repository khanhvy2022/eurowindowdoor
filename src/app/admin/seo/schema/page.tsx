'use client';

import React, { useState } from 'react';
import SchemaPreview from '@/components/seo/SchemaPreview';
import type { SchemaType, SchemaGeneratorResult } from '@/lib/seo/types';

export default function SeoSchemaPage() {
  const [type, setType] = useState<SchemaType>('Product');
  const [name, setName] = useState('Cửa Nhôm Eurowindow EA55');
  const [description, setDescription] = useState('Cửa nhôm cao cấp Eurowindow hệ EA55 cách âm cách nhiệt tốt.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SchemaGeneratorResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: { name, description } }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Schema generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">JSON-LD Schema Generator</h2>
        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Loại Schema</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SchemaType)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
              >
                <option value="Product">Product (Sản phẩm)</option>
                <option value="Article">Article (Bài viết)</option>
                <option value="FAQ">FAQPage (Câu hỏi thường gặp)</option>
                <option value="Organization">Organization (Tổ chức)</option>
                <option value="LocalBusiness">LocalBusiness (Doanh nghiệp địa phương)</option>
                <option value="Breadcrumb">BreadcrumbList (Thanh điều hướng)</option>
                <option value="HowTo">HowTo (Hướng dẫn)</option>
                <option value="Service">Service (Dịch vụ)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tên Tối Tác / Tiêu Đề</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mô Tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#005ba7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : 'Tạo Schema JSON-LD'}
          </button>
        </form>
      </div>

      {result && (
        <SchemaPreview
          jsonLd={result.jsonLd}
          isValid={result.isValid}
          errors={result.validationErrors}
        />
      )}
    </div>
  );
}
