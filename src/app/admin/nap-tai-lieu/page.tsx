'use client';

import React, { useEffect, useState, useRef } from 'react';
import { extractTextFromPDFClient } from '@/lib/pdf-client';

interface DocumentItem {
  id: string;
  file_name: string;
  created_at: string;
  chunkCount?: number;
  source?: string;
}

interface DocumentDetail {
  id: string;
  chunks: { id: string; content: string }[];
  totalChunks: number;
}

const PRESET_SAMPLE_EA55 = `BẢNG THÔNG SỐ KỸ THUẬT VÀ BÁO GIÁ CỬA NHÔM EA55 (EUROWINDOW 2026)

1. TỔNG QUAN HỆ CỬA NHÔM EA55
Hệ nhôm EA55 là dòng sản phẩm cửa nhôm cao cấp của Eurowindow, được thiết kế tối ưu cho công trình dân dụng và dự án thương mại với độ dày profile từ 1.4mm - 2.0mm.
- Độ rộng thanh khung bao: 55mm
- Hệ phụ kiện đồng bộ: Eurowindow Metallic Premium / Roto Frank (Đức)
- Hệ gioăng: EPDM kép chống ngấm nước, cách âm đạt 38dB
- Kính áp dụng: Kính đơn 6mm-10mm, kính dán an toàn 8.38mm, kính hộp cách âm 19mm.

2. CÁC HỆ CỬA VÀ ĐƠN GIÁ THAM KHẢO
- Cửa mở quay 1 cánh / 2 cánh EA55: Đơn giá từ 2.450.000 VNĐ/m2 - 3.200.000 VNĐ/m2 (Chưa bao gồm VAT và phụ kiện).
- Cửa trượt / lùa EA55 2 cánh & 4 cánh: Đơn giá từ 2.150.000 VNĐ/m2 - 2.850.000 VNĐ/m2.
- Cửa xếp trượt EA55 đa cánh: Đơn giá từ 3.500.000 VNĐ/m2.

3. MÀU SẮC CHÍNH THỨC
- Trắng sứ sơn tĩnh điện (Bảo hành 10 năm)
- Ghi xám metallic
- Nâu café sần
- Vân gỗ tự nhiên cao cấp (Công nghệ chuyển in nhiệt Đức).`;

const PRESET_SAMPLE_EA60I = `CATALOGUE CHI TIẾT CỬA NHÔM CÓ CẦN CÁCH NHIỆT EA60I

1. GIỚI THIỆU DÒNG CỬA CẦN CÁCH NHIỆT EA60i
Dòng cửa nhôm EA60i Eurowindow tích hợp dải polyamide cách nhiệt (Thermal Break) nhập khẩu Châu Âu, giảm 40% truyền nhiệt trực tiếp so với nhôm thông thường.
- Độ dày profile: 1.8mm - 2.2mm
- Cấu trúc thanh nhôm: 3 khoang độc lập kết hợp dải Polyamide cách nhiệt 24mm.
- Cách âm: Chống ồn tới 42dB.
- Ứng dụng: Biệt thự cao cấp, Penthouse, Resort ven biển.

2. BẢO HÀNH & TIÊU CHUẨN KỸ THUẬT
- Tiêu chuẩn xuất khẩu Châu Âu EN 12207 / EN 12208.
- Sơn phủ bề mặt AkzoNobel bảo hành chống phai màu 20 năm.
- Đơn giá trung bình hoàn thiện: 4.800.000 VNĐ/m2 - 6.500.000 VNĐ/m2 (Bao gồm phụ kiện Roto/Hopo).`;

export default function IngestDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'website' | 'catalogue' | 'file'>('all');

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'ingest' | 'crawl' | 'test'>('ingest');

  // Ingest Form States
  const [ingestMode, setIngestMode] = useState<'text' | 'file'>('file');
  const [fileName, setFileName] = useState('Catalogue_EA55_EA60i_2026.txt');
  const [textContent, setTextContent] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [ingestMsg, setIngestMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Drag and drop target state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crawl States
  const [targetUrl, setTargetUrl] = useState('https://eurowindow.biz');
  const [crawling, setCrawling] = useState(false);
  const [crawlMsg, setCrawlMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // RAG Tester States
  const [testQuery, setTestQuery] = useState('');
  const [testingRAG, setTestingRAG] = useState(false);
  const [testResult, setTestResult] = useState<{
    query: string;
    retrievedChunksCount: number;
    chunks: string[];
    durationMs: number;
  } | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Document Detail Modal State
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    loading: boolean;
    docName: string;
    detail: DocumentDetail | null;
  }>({
    open: false,
    loading: false,
    docName: '',
    detail: null,
  });

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch(`/api/admin/documents?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [searchQuery]);

  // Handle File Selection (Extract PDF text client-side if PDF)
  const processFileSelection = async (selectedFile: File) => {
    setFileInput(selectedFile);
    setFileName(selectedFile.name);
    setIngestMsg(null);

    if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
      setExtractingPdf(true);
      setIngestMsg({ type: 'info', text: '📄 Đang trích xuất nội dung văn bản từ PDF (Client Engine)...' });
      try {
        const extracted = await extractTextFromPDFClient(selectedFile);
        if (extracted && extracted.length > 20) {
          setTextContent(extracted);
          setIngestMsg({
            type: 'success',
            text: `✅ Trích xuất thành công ${extracted.length} ký tự từ file PDF "${selectedFile.name}".`,
          });
        } else {
          setIngestMsg({
            type: 'error',
            text: '⚠️ Không thể đọc văn bản trong PDF (có thể là dạng ảnh scan). Bạn hãy dán nội dung chữ thủ công.',
          });
        }
      } catch (err: any) {
        setIngestMsg({ type: 'error', text: `❌ Lỗi đọc PDF: ${err.message}` });
      } finally {
        setExtractingPdf(false);
      }
    } else {
      // Read plain text file
      try {
        const text = await selectedFile.text();
        setTextContent(text);
        setIngestMsg({ type: 'success', text: `✅ Đã đọc xong tệp "${selectedFile.name}" (${text.length} ký tự).` });
      } catch (e) {
        setTextContent('');
      }
    }
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngesting(true);
    setIngestMsg({ type: 'info', text: '⚡ LiteParse Engine đang phân tích cấu trúc & nạp vào Knowledge Base...' });

    try {
      const formData = new FormData();
      if (ingestMode === 'file' && fileInput) {
        formData.append('file', fileInput);
        formData.append('fileName', fileName || fileInput.name);
        if (textContent) formData.append('textContent', textContent);
      } else {
        formData.append('textContent', textContent);
        formData.append('fileName', fileName);
      }

      const res = await fetch('/api/admin/ingest-catalogue', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setIngestMsg({ type: 'success', text: `✅ ${data.message}` });
        setTextContent('');
        setFileInput(null);
        fetchDocuments();
      } else {
        setIngestMsg({ type: 'error', text: `❌ Lỗi: ${data.error}` });
      }
    } catch (err: any) {
      setIngestMsg({ type: 'error', text: `❌ Lỗi kết nối: ${err.message}` });
    } finally {
      setIngesting(false);
    }
  };

  const handleRunCrawl = async () => {
    setCrawling(true);
    setCrawlMsg({ type: 'info', text: `🌐 Đang cào và đồng bộ dữ liệu từ ${targetUrl}...` });
    try {
      const res = await fetch('/api/admin/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets: [targetUrl] }),
      });
      const data = await res.json();
      if (data.success) {
        setCrawlMsg({ type: 'success', text: `✅ ${data.message}` });
        fetchDocuments();
      } else {
        setCrawlMsg({ type: 'error', text: `❌ Lỗi: ${data.error}` });
      }
    } catch (err: any) {
      setCrawlMsg({ type: 'error', text: `❌ Lỗi kết nối: ${err.message}` });
    } finally {
      setCrawling(false);
    }
  };

  const handleTestRAG = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setTestingRAG(true);
    setTestError(null);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/test-retrieval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery }),
      });
      const data = await res.json();

      if (data.success) {
        setTestResult(data);
      } else {
        setTestError(data.error || 'Lỗi tra cứu tri thức');
      }
    } catch (err: any) {
      setTestError(err.message || 'Lỗi kết nối tới máy chủ');
    } finally {
      setTestingRAG(false);
    }
  };

  const handleDeleteDocument = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài liệu "${name}" khỏi Knowledge Base?`)) return;

    try {
      const res = await fetch(`/api/admin/documents?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      } else {
        alert(`Không thể xóa: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Lỗi khi xóa: ${err.message}`);
    }
  };

  const handleOpenDetailModal = async (doc: DocumentItem) => {
    setDetailModal({
      open: true,
      loading: true,
      docName: doc.file_name,
      detail: null,
    });

    try {
      const res = await fetch(`/api/admin/documents?id=${encodeURIComponent(doc.id)}`);
      const data = await res.json();
      if (data.success) {
        setDetailModal(prev => ({
          ...prev,
          loading: false,
          detail: data.data,
        }));
      } else {
        alert('Không thể tải chi tiết tài liệu');
        setDetailModal(prev => ({ ...prev, open: false, loading: false }));
      }
    } catch (e) {
      alert('Lỗi kết nối khi tải chi tiết tài liệu');
      setDetailModal(prev => ({ ...prev, open: false, loading: false }));
    }
  };

  // Filtering documents
  const filteredDocuments = documents.filter(doc => {
    if (categoryFilter === 'website') return doc.file_name.startsWith('[Website]');
    if (categoryFilter === 'catalogue') return doc.file_name.startsWith('[LiteParse]');
    if (categoryFilter === 'file') return !doc.file_name.startsWith('[Website]') && !doc.file_name.startsWith('[LiteParse]');
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              🧠
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Nạp & Quản Lý Kho Tri Thức AI</h1>
              <p className="text-sm text-gray-500 font-medium">Eurowindow AI Knowledge Base Engine • Supabase & MongoDB Vector RAG</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDocuments}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <span>🔄</span> Tải Lại Dữ Liệu
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tổng Số Tài Liệu</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{documents.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#005ba7] flex items-center justify-center text-lg font-bold">
            📚
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bộ Xử Lý Văn Bản</p>
            <p className="text-sm font-bold text-indigo-700 mt-1">LiteParse v2.0</p>
            <span className="text-[10px] text-gray-500">Giữ nguyên cấu trúc Bảng & Spec</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">
            ⚡
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Đồng Bộ Website</p>
            <p className="text-sm font-bold text-emerald-700 mt-1">Crawl4AI Engine</p>
            <span className="text-[10px] text-gray-500">Auto Sync eurowindow.biz</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
            🌐
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mô Hình Embeddings</p>
            <p className="text-sm font-bold text-amber-700 mt-1">Gemini 768d Vector</p>
            <span className="text-[10px] text-gray-500">Hybrid BM25 + Graph Rerank</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
            🎯
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="bg-gray-100 p-1.5 rounded-xl flex items-center gap-2 border border-gray-200">
        <button
          onClick={() => setActiveTab('ingest')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 ${
            activeTab === 'ingest'
              ? 'bg-[#005ba7] text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <span>📄</span> Nạp Catalogue & File Kỹ Thuật
        </button>

        <button
          onClick={() => setActiveTab('crawl')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 ${
            activeTab === 'crawl'
              ? 'bg-[#005ba7] text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <span>🌐</span> Đồng Bộ Website (Crawl4AI)
        </button>

        <button
          onClick={() => setActiveTab('test')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 ${
            activeTab === 'test'
              ? 'bg-[#005ba7] text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <span>⚡</span> Tra Cứu & Chẩn Đoán AI (RAG Tester)
        </button>
      </div>

      {/* Tab Content 1: Ingest Catalogue / Text / PDF */}
      {activeTab === 'ingest' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">📄 Nạp Tài Liệu & Catalogue Kỹ Thuật</h2>
              <p className="text-xs text-gray-500">
                Tự động bóc tách bảng thông số, đơn giá và hệ cửa bằng công nghệ LiteParse
              </p>
            </div>

            {/* Sub-mode selector */}
            <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold self-start">
              <button
                type="button"
                onClick={() => setIngestMode('file')}
                className={`px-3 py-1.5 rounded transition ${
                  ingestMode === 'file' ? 'bg-[#005ba7] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📁 Tải Tệp Lên (PDF, TXT, MD)
              </button>
              <button
                type="button"
                onClick={() => setIngestMode('text')}
                className={`px-3 py-1.5 rounded transition ${
                  ingestMode === 'text' ? 'bg-[#005ba7] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📝 Dán Văn Bản / Bảng Giá
              </button>
            </div>
          </div>

          <form onSubmit={handleIngest} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tên tài liệu / Tiêu đề Catalogue <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#005ba7] focus:ring-1 focus:ring-[#005ba7]"
                placeholder="VD: Catalogue_Cua_Nhom_EA60i_2026.pdf"
                required
              />
            </div>

            {ingestMode === 'file' ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gray-700">Tệp Tài Liệu Kỹ Thuật (PDF, TXT, MD, CSV, JSON)</label>
                
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processFileSelection(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#005ba7] bg-blue-50/50 scale-[1.01]'
                      : fileInput
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-gray-300 hover:border-[#005ba7] bg-gray-50/50 hover:bg-blue-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md,.json,.csv"
                    onChange={(e) => {
                      if (e.target.files?.[0]) processFileSelection(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-[#005ba7] mx-auto flex items-center justify-center text-2xl">
                      {fileInput ? '✅' : '📤'}
                    </div>
                    {fileInput ? (
                      <div>
                        <p className="text-sm font-bold text-gray-800">{fileInput.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {(fileInput.size / 1024).toFixed(1)} KB • Nhấp hoặc kéo thả file khác để thay thế
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-gray-700">Kéo & Thả tệp PDF, TXT, MD vào đây</p>
                        <p className="text-xs text-gray-400 mt-1">Hoặc nhấp để chọn tệp từ máy tính (Tối đa 25MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {textContent && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-600">Xem trước văn bản đã bóc tách từ tệp ({textContent.length} ký tự):</span>
                      <button
                        type="button"
                        onClick={() => setTextContent('')}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Xóa bản xem trước
                      </button>
                    </div>
                    <textarea
                      rows={6}
                      value={textContent}
                      onChange={e => setTextContent(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-800 outline-none focus:border-[#005ba7]"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700">Nội dung văn bản / Báo giá / Thông số kỹ thuật</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-semibold">Tải nội dung mẫu:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFileName('Catalogue_Cua_Nhom_EA55_Eurowindow.txt');
                        setTextContent(PRESET_SAMPLE_EA55);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#005ba7] text-[11px] font-bold rounded"
                    >
                      Mẫu EA55
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFileName('Catalogue_EA60i_Cach_Nhiet_2026.txt');
                        setTextContent(PRESET_SAMPLE_EA60I);
                      }}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded"
                    >
                      Mẫu EA60i
                    </button>
                  </div>
                </div>
                <textarea
                  rows={9}
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  className="w-full p-3.5 border border-gray-300 rounded-lg text-xs font-mono outline-none focus:border-[#005ba7] focus:ring-1 focus:ring-[#005ba7]"
                  placeholder="Dán toàn bộ nội dung catalogue, thông số kỹ thuật hoặc bảng báo giá tại đây..."
                  required
                />
              </div>
            )}

            {ingestMsg && (
              <div
                className={`p-3.5 rounded-lg text-xs font-medium border ${
                  ingestMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : ingestMsg.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                {ingestMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={ingesting || extractingPdf || !textContent.trim()}
              className="w-full py-3.5 bg-[#005ba7] hover:bg-[#004077] text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {ingesting ? (
                <>
                  <span className="animate-spin">⏳</span> LiteParse đang phân tích & lưu vào Kho Tri Thức...
                </>
              ) : (
                <>
                  <span>📥</span> Phân Tích Cấu Trúc & Nạp Vào Kho Tri Thức AI
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab Content 2: Crawl4AI Website Sync */}
      {activeTab === 'crawl' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">🌐 Tự Động Đồng Bộ Dữ Liệu Website (Crawl4AI)</h2>
              <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">1-Click Crawl</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cào toàn bộ thông tin sản phẩm, báo giá, showroom và bài viết từ trang web chính thức vào Knowledge Base.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ trang web mục tiêu</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#005ba7]"
                  placeholder="https://eurowindow.biz"
                />
                <button
                  type="button"
                  onClick={() => setTargetUrl('https://eurowindow.biz')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Mặc Định
                </button>
              </div>
            </div>

            {crawlMsg && (
              <div
                className={`p-3.5 rounded-lg text-xs font-medium border ${
                  crawlMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : crawlMsg.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                {crawlMsg.text}
              </div>
            )}

            <button
              onClick={handleRunCrawl}
              disabled={crawling}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {crawling ? (
                <>
                  <span className="animate-spin">⏳</span> Đang thực thi Crawl4AI pipeline...
                </>
              ) : (
                <>
                  <span>🚀</span> Bắt Đầu Đồng Bộ Dữ Liệu Website Ngay
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 3: RAG Retrieval Test Playground */}
      {activeTab === 'test' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">⚡ Tra Cứu & Chẩn Đoán Khả Năng Tìm Kiếm AI (RAG Tester)</h2>
            <p className="text-xs text-gray-500 mt-1">
              Thử nghiệm từ khóa câu hỏi của khách hàng để kiểm tra độ chính xác các đoạn Vector & Knowledge Graph được AI trích xuất.
            </p>
          </div>

          <form onSubmit={handleTestRAG} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={e => setTestQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#005ba7] focus:ring-1 focus:ring-[#005ba7]"
                placeholder="Nhập câu hỏi thử nghiệm (VD: Cửa nhôm EA55 có báo giá bao nhiêu?)..."
              />
              <button
                type="submit"
                disabled={testingRAG || !testQuery.trim()}
                className="px-6 py-3 bg-[#005ba7] hover:bg-[#004077] text-white font-bold text-sm rounded-xl shadow transition disabled:opacity-50"
              >
                {testingRAG ? '⏳ Đang tra cứu...' : '🔍 Chạy Tra Cứu'}
              </button>
            </div>

            {/* Quick Test Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-gray-400 font-medium">Gợi ý từ khóa:</span>
              {['Cửa nhôm EA55', 'Cửa EA60i cách nhiệt', 'Bảng giá uPVC', 'Showroom Hà Nội'].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setTestQuery(q);
                  }}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </form>

          {testError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
              ❌ {testError}
            </div>
          )}

          {testResult && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">
                  Kết quả tìm kiếm cho: &quot;<strong className="text-[#005ba7]">{testResult.query}</strong>&quot;
                </span>
                <span className="text-[11px] px-2.5 py-0.5 bg-blue-50 text-[#005ba7] rounded-full font-semibold">
                  {testResult.retrievedChunksCount} Chunks trích xuất • {testResult.durationMs}ms
                </span>
              </div>

              {testResult.chunks.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-xs italic bg-gray-50 rounded-xl">
                  Không tìm thấy đoạn tri thức phù hợp trong Kho Tri Thức.
                </div>
              ) : (
                <div className="space-y-3">
                  {testResult.chunks.map((chunk, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold border-b border-gray-200 pb-1.5">
                        <span className="text-[#005ba7]">Đoạn Tri Thức #{idx + 1}</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">Active Vector Match</span>
                      </div>
                      <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {chunk}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Documents Library Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">📚 Danh Sách Tài Liệu Trong Kho Tri Thức</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Các tệp & dữ liệu cào đang được AI dùng để trả lời tự động cho khách hàng
            </p>
          </div>

          {/* Category Filter Badges */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded transition ${categoryFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
            >
              Tất Cả ({documents.length})
            </button>
            <button
              onClick={() => setCategoryFilter('catalogue')}
              className={`px-3 py-1 rounded transition ${categoryFilter === 'catalogue' ? 'bg-white text-[#005ba7] shadow-sm' : 'text-gray-600'}`}
            >
              Catalogue
            </button>
            <button
              onClick={() => setCategoryFilter('website')}
              className={`px-3 py-1 rounded transition ${categoryFilter === 'website' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
            >
              Website
            </button>
            <button
              onClick={() => setCategoryFilter('file')}
              className={`px-3 py-1 rounded transition ${categoryFilter === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
            >
              Khác
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Tìm kiếm tài liệu theo tên..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#005ba7]"
          />
          <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>

        {loadingDocs ? (
          <div className="py-12 text-center text-gray-400 text-xs italic">
            ⏳ Đang tải danh sách tài liệu từ cơ sở dữ liệu...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs italic bg-gray-50 rounded-xl">
            Không tìm thấy tài liệu nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tên Tài Liệu / Tệp</th>
                  <th className="py-3.5 px-4">Phân Loại</th>
                  <th className="py-3.5 px-4">Nguồn Lưu Trữ</th>
                  <th className="py-3.5 px-4">Ngày Nạp</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDocuments.map(doc => {
                  const isWebsite = doc.file_name.startsWith('[Website]');
                  const isCatalogue = doc.file_name.startsWith('[LiteParse]');

                  return (
                    <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        {doc.file_name}
                      </td>
                      <td className="py-3.5 px-4">
                        {isWebsite ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
                            🌐 Website Scraping
                          </span>
                        ) : isCatalogue ? (
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-bold text-[10px]">
                            📄 Catalogue Spec
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full font-bold text-[10px]">
                            📁 Tệp Tải Lên
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                        {doc.source || 'Vector DB'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString('vi-VN')} {' '}
                        <span className="text-[11px] text-gray-400">
                          {new Date(doc.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenDetailModal(doc)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#005ba7] rounded-lg text-xs font-semibold transition"
                        >
                          👁️ Chi Tiết
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.file_name)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition"
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Detail Preview Modal */}
      {detailModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-base">📄 Chi Tiết Đoạn Tri Thức AI</h3>
                <p className="text-xs text-gray-500">{detailModal.docName}</p>
              </div>
              <button
                onClick={() => setDetailModal(prev => ({ ...prev, open: false }))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {detailModal.loading ? (
                <div className="py-12 text-center text-gray-400 text-xs italic">
                  ⏳ Đang tải nội dung các đoạn tri thức...
                </div>
              ) : !detailModal.detail || detailModal.detail.chunks.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs italic">
                  Không tìm thấy đoạn tri thức chi tiết nào.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold border-b pb-2">
                    <span>Tổng số đoạn (chunks): <strong>{detailModal.detail.totalChunks}</strong></span>
                    <span>Vector Dim: 768d</span>
                  </div>
                  {detailModal.detail.chunks.map((chunk, i) => (
                    <div key={chunk.id || i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                      <div className="text-[11px] font-bold text-[#005ba7]">
                        Chunk #{i + 1} • ID: {chunk.id || `chunk-${i}`}
                      </div>
                      <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {chunk.content}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setDetailModal(prev => ({ ...prev, open: false }))}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
