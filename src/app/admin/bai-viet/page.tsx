'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ArticleManagerPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchArticles();
        }
      } catch (error) {
        alert('Xóa thất bại');
      }
    }
  };

  const filteredArticles = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Quản Lý Bài Viết</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Danh sách bài viết tin tức & sản phẩm trên website Eurowindow</p>
        </div>
        <Link
          href="/admin/bai-viet/them-moi"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[#005ba7] hover:bg-[#004077] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition"
        >
          ➕ Thêm Bài Viết Mới
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Tìm kiếm bài viết theo tiêu đề hoặc slug..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:border-[#005ba7] shadow-xs"
        />
        <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm">🔍</span>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs sm:text-sm italic">
            ⏳ Đang tải danh sách bài viết...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs sm:text-sm italic">
            Không tìm thấy bài viết nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase font-bold text-[11px] tracking-wider">
                  <th className="p-3 sm:p-4">Hình ảnh</th>
                  <th className="p-3 sm:p-4">Tiêu đề & Slug</th>
                  <th className="p-3 sm:p-4">Danh mục</th>
                  <th className="p-3 sm:p-4">Ngày đăng</th>
                  <th className="p-3 sm:p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id || article.slug} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3 sm:p-4">
                      <img
                        src={article.image || '/images/default.jpg'}
                        alt={article.title}
                        className="w-14 h-10 sm:w-16 sm:h-12 object-cover rounded-lg border border-gray-200 bg-gray-100"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', 'https://via.placeholder.com/150?text=No+Image');
                        }}
                      />
                    </td>
                    <td className="p-3 sm:p-4 max-w-xs sm:max-w-md">
                      <div className="font-bold text-gray-900 line-clamp-2 leading-snug">{article.title}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">{article.slug}</div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] sm:text-xs font-bold border border-gray-200">
                        {article.category || 'Tin tức'}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-xs text-gray-500 whitespace-nowrap">
                      {article.date || 'Gần đây'}
                    </td>
                    <td className="p-3 sm:p-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        href={`/admin/bai-viet/${article.id || article.slug}/chinh-sua`}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#005ba7] rounded-lg text-xs font-bold transition inline-block"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id || article.slug)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition inline-block"
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
