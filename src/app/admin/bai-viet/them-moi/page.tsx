'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Editor from '@/components/Editor';
export default function AddArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Tin tức',
    date: new Date().toISOString().split('T')[0],
    image: '',
    excerpt: '',
    content: ''
  });

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title' && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/admin/bai-viet');
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 space-x-4">
        <Link href="/admin/bai-viet" className="text-gray-500 hover:text-gray-800">
          &larr; Quay lại
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Thêm Bài Viết Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:ring-[#005ba7]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn (slug)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:ring-[#005ba7]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:ring-[#005ba7]">
                <option value="Tin tức">Tin tức</option>
                <option value="Sự kiện">Sự kiện</option>
                <option value="Khuyến mãi">Khuyến mãi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:ring-[#005ba7]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh Cover</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="/images/news/..." className="w-full px-3 py-2 border rounded focus:ring-[#005ba7]" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn (Excerpt)</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded focus:ring-[#005ba7]"></textarea>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung bài viết</label>
          <Editor 
            value={formData.content} 
            onChange={(val) => setFormData(prev => ({ ...prev, content: val }))} 
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Link href="/admin/bai-viet" className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
            Hủy
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#005ba7] text-white rounded hover:bg-[#004077] disabled:opacity-50">
            {loading ? 'Đang lưu...' : 'Lưu Bài Viết'}
          </button>
        </div>
      </form>
    </div>
  );
}
