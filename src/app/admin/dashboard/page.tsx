'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ total: 0, loading: true });

  // Crawl state
  const [crawling, setCrawling] = useState(false);
  const [crawlMsg, setCrawlMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Ingest Catalogue state
  const [ingesting, setIngesting] = useState(false);
  const [catalogueText, setCatalogueText] = useState('');
  const [catalogueName, setCatalogueName] = useState('Catalogue_EA55_EA60i.txt');
  const [ingestMsg, setIngestMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/articles');
        const data = await res.json();
        if (data.success) {
          setStats({ total: data.data.length, loading: false });
        }
      } catch (error) {
        console.error(error);
        setStats({ total: 0, loading: false });
      }
    };
    fetchStats();
  }, []);

  const handleRunCrawl = async () => {
    setCrawling(true);
    setCrawlMsg({ type: 'info', text: '🌐 Đang đồng bộ dữ liệu từ website eurowindow.biz...' });
    try {
      const res = await fetch('/api/admin/crawl', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCrawlMsg({ type: 'success', text: `✅ ${data.message}` });
      } else {
        setCrawlMsg({ type: 'error', text: `❌ Lỗi: ${data.error}` });
      }
    } catch (err: any) {
      setCrawlMsg({ type: 'error', text: `❌ Lỗi kết nối: ${err.message}` });
    } finally {
      setCrawling(false);
    }
  };

  const handleIngestCatalogue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogueText.trim()) return;

    setIngesting(true);
    setIngestMsg({ type: 'info', text: '⏳ LiteParse đang trích xuất và lưu bảng thông số...' });
    try {
      const formData = new FormData();
      formData.append('textContent', catalogueText);
      formData.append('fileName', catalogueName);

      const res = await fetch('/api/admin/ingest-catalogue', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setIngestMsg({ type: 'success', text: `✅ ${data.message}` });
        setCatalogueText('');
      } else {
        setIngestMsg({ type: 'error', text: `❌ Lỗi: ${data.error}` });
      }
    } catch (err: any) {
      setIngestMsg({ type: 'error', text: `❌ Lỗi nạp tài liệu: ${err.message}` });
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-10">
      {/* Page Title Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Bảng Điều Khiển Admin</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Quản lý nội dung bài viết và hệ thống AI RAG Suite cho Eurowindow
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Bài Viết Website</h2>
            <div className="text-2xl sm:text-3xl font-black text-[#005ba7] mt-1">
              {stats.loading ? '...' : stats.total}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Đã đồng bộ</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#005ba7] flex items-center justify-center text-xl font-bold">
            📝
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Hybrid Graph RAG</h2>
            <div className="text-sm sm:text-base font-bold text-emerald-600 mt-1">Vector + Graph</div>
            <p className="text-[11px] text-gray-500 mt-1">4 Hệ cửa & Phụ kiện</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            🧠
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">LiteParse Catalogue</h2>
            <div className="text-sm sm:text-base font-bold text-indigo-600 mt-1">Preserved Tables</div>
            <p className="text-[11px] text-gray-500 mt-1">EA55, EA60i, Kommerling</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
            📄
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Reranker Engine</h2>
            <div className="text-sm sm:text-base font-bold text-purple-600 mt-1">Cross-Scoring</div>
            <p className="text-[11px] text-gray-500 mt-1">Độ chính xác &gt; 95%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
            🎯
          </div>
        </div>
      </div>

      {/* RAG Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crawl4AI Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">🌐 Crawl4AI Web Sync</h2>
              <span className="text-[11px] px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold">Tự động định kỳ</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
              Cào và đồng bộ toàn bộ nội dung sản phẩm, thông số cửa, tin tức từ website chính thức Eurowindow.biz vào Vector Store.
            </p>
          </div>

          <div>
            {crawlMsg && (
              <div
                className={`mb-4 text-xs p-3 rounded-lg border font-medium ${
                  crawlMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : crawlMsg.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                {crawlMsg.text}
              </div>
            )}
            <button
              onClick={handleRunCrawl}
              disabled={crawling}
              className="w-full py-3 bg-[#005ba7] hover:bg-[#004077] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {crawling ? '⏳ Đang đồng bộ website...' : '🚀 Chạy Đồng Bộ Website Ngay'}
            </button>
          </div>
        </div>

        {/* LiteParse Ingest Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">📄 LiteParse Catalogue Ingestion</h2>
            <span className="text-[11px] px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-bold">PDF & Spec Matrix</span>
          </div>

          <form onSubmit={handleIngestCatalogue} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tên file tài liệu / Catalogue</label>
              <input
                type="text"
                value={catalogueName}
                onChange={e => setCatalogueName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm outline-none focus:border-[#005ba7]"
                placeholder="VD: Catalogue_Cua_Nhom_EA60i.txt"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nội dung văn bản / Bảng báo giá</label>
              <textarea
                rows={4}
                value={catalogueText}
                onChange={e => setCatalogueText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-xs font-mono outline-none focus:border-[#005ba7]"
                placeholder="Dán nội dung catalogue hoặc bảng thông số kỹ thuật tại đây..."
              />
            </div>

            {ingestMsg && (
              <div
                className={`text-xs p-3 rounded-lg border font-medium ${
                  ingestMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : ingestMsg.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                }`}
              >
                {ingestMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={ingesting || !catalogueText.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {ingesting ? '⏳ LiteParse đang xử lý...' : '📥 Phân Tích & Nạp Vào Knowledge Base'}
            </button>
          </form>
        </div>
      </div>

      {/* Quick Action Navigation Links (Mobile Responsive Stack) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">Quản Lý & Tác Vụ Nhanh</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/bai-viet/them-moi"
            className="flex-1 py-3 px-4 bg-[#005ba7] hover:bg-[#004077] text-white text-center rounded-xl font-bold text-xs shadow-xs transition"
          >
            ➕ Viết Bài Mới
          </Link>
          <Link
            href="/admin/nap-tai-lieu"
            className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-center rounded-xl font-bold text-xs transition"
          >
            🧠 Quản Lý Kho Tri Thức AI
          </Link>
          <Link
            href="/admin/bai-viet"
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center rounded-xl font-bold text-xs transition"
          >
            📝 Danh Sách Bài Viết
          </Link>
          <Link
            href="/chat"
            className="flex-1 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-center rounded-xl font-bold text-xs transition"
          >
            💬 Thử Nghiệm Chatbot AI
          </Link>
        </div>
      </div>
    </div>
  );
}
