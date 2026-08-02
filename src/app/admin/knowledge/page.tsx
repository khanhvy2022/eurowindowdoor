'use client';

import React, { useEffect, useState } from 'react';

interface PackSummary {
  id: string;
  doc_title: string;
  source: string;
  series: string;
  confidence: number;
  overall_score: number;
  chunk_count: number;
  created_at: string;
}

interface PackDetail {
  id: string;
  doc_title: string;
  source: string;
  metadata: any;
  quality: any;
  files: Record<string, string>;
}

export default function AdminKnowledgeCompilerPage() {
  const [packs, setPacks] = useState<PackSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [compilerEnabled, setCompilerEnabled] = useState(true);
  const [selectedPack, setSelectedPack] = useState<PackDetail | null>(null);
  const [activeFileTab, setActiveFileTab] = useState<string>('overview.md');
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Manual Compile Form State
  const [compileTitle, setCompileTitle] = useState('Catalogue_Tong_Hop_Eurowindow_2026.txt');
  const [compileContent, setCompileContent] = useState('');
  const [compiling, setCompiling] = useState(false);

  const fetchPacks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/knowledge');
      const data = await res.json();
      if (data.success) {
        setPacks(data.packs || []);
        setCompilerEnabled(data.enabled);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  const handleManualCompile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compileContent.trim()) return;

    setCompiling(true);
    setStatusMsg({ type: 'info', text: '⚡ Knowledge Compiler (Book-to-Skill Engine) đang biên dịch tài liệu thành 16 file Knowledge Pack...' });

    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'compile',
          docTitle: compileTitle,
          content: compileContent,
          source: 'Thủ công từ Admin Portal',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `✅ ${data.message}` });
        setCompileContent('');
        fetchPacks();
      } else {
        setStatusMsg({ type: 'error', text: `❌ Lỗi: ${data.error}` });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `❌ Lỗi kết nối: ${err.message}` });
    } finally {
      setCompiling(false);
    }
  };

  const handleInspectPack = async (packId: string) => {
    setActionLoading(`inspect_${packId}`);
    try {
      const res = await fetch(`/api/admin/knowledge?id=${encodeURIComponent(packId)}`);
      const data = await res.json();
      if (data.success && data.pack) {
        setSelectedPack(data.pack);
        setActiveFileTab('overview.md');
        setModalOpen(true);
      } else {
        alert('Không thể tải chi tiết Knowledge Pack');
      }
    } catch (e) {
      alert('Lỗi kết nối tải dữ liệu');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRebuildGraph = async (packId: string) => {
    setActionLoading(`graph_${packId}`);
    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rebuild_graph', packId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
      } else {
        alert(`❌ Lỗi: ${data.error}`);
      }
    } catch (e) {
      alert('Lỗi kết nối');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRebuildEmbedding = async (packId: string) => {
    setActionLoading(`embed_${packId}`);
    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rebuild_embedding', packId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
      } else {
        alert(`❌ Lỗi: ${data.error}`);
      }
    } catch (e) {
      alert('Lỗi kết nối');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadPack = (pack: PackDetail | PackSummary) => {
    const jsonStr = JSON.stringify(pack, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KnowledgePack_${pack.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            📦
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Knowledge Compiler (Book-to-Skill Engine)</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Biên dịch tài liệu thành 16-file Knowledge Packs cho Hybrid Graph RAG</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${compilerEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {compilerEnabled ? '● Compiler Active' : '○ Compiler Disabled'}
          </span>
          <a
            href="/admin/knowledge/debug"
            className="px-3.5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
          >
            📊 Debug Retrieval & Router
          </a>
          <button
            onClick={fetchPacks}
            className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 shadow-xs"
          >
            🔄 Tải Lại Dữ Liệu
          </button>
        </div>
      </div>

      {/* Manual Compilation Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">⚡ Biên Dịch Tri Thức Mới</h2>
          <p className="text-xs text-gray-500">Chuyển tài liệu thô thành Knowledge Pack (16 Markdown/JSON Specs) tự động</p>
        </div>

        <form onSubmit={handleManualCompile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tên tài liệu / Catalogue nguồn</label>
            <input
              type="text"
              value={compileTitle}
              onChange={e => setCompileTitle(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm outline-none focus:border-[#005ba7]"
              placeholder="VD: Catalogue_Cua_Nhom_EA55_EA60i_2026.txt"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nội dung văn bản / Bảng giá / Quy trình kỹ thuật</label>
            <textarea
              rows={5}
              value={compileContent}
              onChange={e => setCompileContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-xs font-mono outline-none focus:border-[#005ba7]"
              placeholder="Dán toàn bộ văn bản hoặc thông số kỹ thuật sản phẩm Eurowindow tại đây..."
              required
            />
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-lg text-xs font-semibold border ${
              statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
              statusMsg.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
              'bg-purple-50 border-purple-200 text-purple-900'
            }`}>
              {statusMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={compiling || !compileContent.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {compiling ? '⏳ Đang phân tích & tạo 16-file Knowledge Pack...' : '🚀 Biên Dịch Ngay (Compile Knowledge Pack)'}
          </button>
        </form>
      </div>

      {/* Knowledge Packs List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">📚 Kho Knowledge Packs Đã Biên Dịch</h2>
            <p className="text-xs text-gray-500">Các gói tri thức chuẩn hóa đang phục vụ Hybrid Graph RAG Engine</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 font-bold rounded-full border border-purple-200">
            {packs.length} Knowledge Packs
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-xs italic">
            ⏳ Đang tải danh sách Knowledge Packs...
          </div>
        ) : packs.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs italic bg-gray-50 rounded-xl">
            Chưa có Knowledge Pack nào được tạo. Hãy dán nội dung ở trên hoặc chạy Crawl4AI để tự động biên dịch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-3">Mã Pack & Tiêu Đề</th>
                  <th className="p-3">Hệ Cửa</th>
                  <th className="p-3">Chất Lượng</th>
                  <th className="p-3">Chunks</th>
                  <th className="p-3">Ngày Biên Dịch</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packs.map(pack => (
                  <tr key={pack.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-gray-900 truncate">{pack.doc_title}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{pack.id} • {pack.source}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold text-[10px] border border-indigo-200">
                        {pack.series || 'Eurowindow'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        pack.overall_score >= 0.85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {(pack.overall_score * 100).toFixed(0)}% Passed
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 font-mono font-semibold">
                      {pack.chunk_count} chunks
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(pack.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleInspectPack(pack.id)}
                        disabled={actionLoading === `inspect_${pack.id}`}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-[11px] font-bold transition"
                      >
                        👁️ Xem 16 Files
                      </button>
                      <button
                        onClick={() => handleRebuildGraph(pack.id)}
                        disabled={actionLoading === `graph_${pack.id}`}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#005ba7] rounded text-[11px] font-bold transition"
                      >
                        🕸️ Rebuild Graph
                      </button>
                      <button
                        onClick={() => handleRebuildEmbedding(pack.id)}
                        disabled={actionLoading === `embed_${pack.id}`}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-bold transition"
                      >
                        🎯 Rebuild Embed
                      </button>
                      <button
                        onClick={() => handleDownloadPack(pack)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-bold transition"
                      >
                        📥 Download JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail 16-File Inspector Modal */}
      {modalOpen && selectedPack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-purple-50">
              <div>
                <h3 className="font-bold text-gray-900 text-base">📦 Knowledge Pack Inspector</h3>
                <p className="text-xs text-purple-800 font-medium">{selectedPack.doc_title} ({selectedPack.id})</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-gray-700 hover:bg-gray-200 flex items-center justify-center font-bold text-sm shadow-xs"
              >
                ✕
              </button>
            </div>

            {/* File List Tabs */}
            <div className="bg-gray-100 p-2 overflow-x-auto flex items-center gap-1 border-b border-gray-200 text-xs font-bold">
              {Object.keys(selectedPack.files).map(filename => (
                <button
                  key={filename}
                  onClick={() => setActiveFileTab(filename)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeFileTab === filename ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filename}
                </button>
              ))}
            </div>

            {/* File Content Viewer */}
            <div className="p-5 overflow-y-auto flex-1 bg-gray-50 font-mono text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
              {selectedPack.files[activeFileTab] || 'Nội dung file rỗng hoặc chưa biên dịch.'}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold">Quality Score: {((selectedPack.quality?.overall_score || 0.95) * 100).toFixed(0)}%</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadPack(selectedPack)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  📥 Download Full Pack JSON
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-bold"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
