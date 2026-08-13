'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SEOScorePanel } from '@/app/admin/components/seo/SEOScorePanel';
import { ArticlePreviewModal } from '@/app/admin/components/ArticlePreviewModal';
import { SEOAnalysisResult } from '@/lib/seo/analyzer/types';

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => <div className="p-4 bg-gray-50 text-gray-500 text-xs italic rounded-xl border border-gray-200">⏳ Đang tải trình soạn thảo văn bản...</div>
});

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [id, setId] = useState<string>('');
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showLowScoreModal, setShowLowScoreModal] = useState(false);
  const [seoResult, setSeoResult] = useState<SEOAnalysisResult | null>(null);

  const [focusKeyword, setFocusKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    date: '',
    image: '',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
        const res = await fetch(`/api/admin/articles/${resolvedParams.id}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setFormData({
            title: data.data.title || '',
            slug: data.data.slug || '',
            category: data.data.category || 'Tin tức',
            date: data.data.date || '',
            image: data.data.image || '',
            excerpt: data.data.excerpt || '',
            content: data.data.content || ''
          });
          if (data.data.focusKeyword) setFocusKeyword(data.data.focusKeyword);
          if (data.data.secondaryKeywords) setSecondaryKeywords(data.data.secondaryKeywords);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchArticle();
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const executeSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        focusKeyword,
        secondaryKeywords,
        seoScore: seoResult?.overallScore || 0,
        seoAnalysis: seoResult
      };

      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
      setShowLowScoreModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seoResult && seoResult.overallScore < 60) {
      setShowLowScoreModal(true);
    } else {
      executeSubmit();
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-center text-gray-500 font-semibold">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/bai-viet" className="text-gray-500 hover:text-gray-800 text-sm font-semibold">
            &larr; Quay lại
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Chỉnh Sửa Bài Viết</h1>
        </div>

        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center gap-2 shadow-xs"
        >
          <span>👁️</span> Xem trước bài đăng (Preview)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-xs border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tiêu đề bài viết</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-[#005ba7]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Đường dẫn (slug)</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-[#005ba7]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Danh mục</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-[#005ba7]">
                  <option value="Tin tức">Tin tức</option>
                  <option value="Sự kiện">Sự kiện</option>
                  <option value="Khuyến mãi">Khuyến mãi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ngày đăng</label>
                <input type="text" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-[#005ba7]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Link Ảnh Cover</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-[#005ba7]" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả ngắn (Excerpt)</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={5} className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-[#005ba7]"></textarea>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nội dung bài viết</label>
            <Editor 
              value={formData.content} 
              onChange={(val) => setFormData(prev => ({ ...prev, content: val }))} 
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Link href="/admin/bai-viet" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-xs font-bold">
              Hủy
            </Link>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-[#005ba7] text-white text-xs font-bold rounded-xl hover:bg-[#004077] disabled:opacity-50 transition shadow-xs">
              {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </div>

        {/* Sidebar SEO Panel */}
        <div className="lg:col-span-1">
          <SEOScorePanel
            data={formData}
            focusKeyword={focusKeyword}
            secondaryKeywords={secondaryKeywords}
            onChangeFocusKeyword={setFocusKeyword}
            onChangeSecondaryKeywords={setSecondaryKeywords}
            onAnalysisChange={setSeoResult}
          />
        </div>
      </form>

      {/* Article Preview Modal */}
      <ArticlePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={formData}
        category={formData.category}
        date={formData.date}
      />

      {/* Low SEO Score Warning Modal */}
      {showLowScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-red-100">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-black text-base text-gray-900">Điểm SEO Thấp ({seoResult?.overallScore}/100)</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Bài viết hiện đạt <strong className="text-red-600">{seoResult?.overallScore} điểm SEO</strong> (dưới ngưỡng khuyến nghị 60). Việc cập nhật bài viết chất lượng SEO thấp có thể ảnh hưởng đến thứ hạng website Eurowindow trên Google.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowLowScoreModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200"
              >
                Quay lại tối ưu
              </button>
              <button
                type="button"
                onClick={executeSubmit}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
              >
                Vẫn cập nhật (Publish Anyway)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
