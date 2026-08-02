'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Gauge, Database, ArrowLeft, RefreshCw, Cpu, CheckCircle, AlertTriangle, Layers } from 'lucide-react';

export default function AdminKnowledgeDebugPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  const fetchDebugInfo = async (searchQuery?: string) => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/api/admin/debug-retrieval?q=${encodeURIComponent(searchQuery)}`
        : `/api/admin/debug-retrieval`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setDebugData(data);
      }
    } catch (err) {
      console.error('Failed to fetch debug info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  const handleTestSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchDebugInfo(query.trim());
  };

  const details = debugData?.details || debugData?.lastDebug;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/knowledge" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Gauge className="w-6 h-6 text-blue-500" /> Enterprise RAG & AI Router Debugger
            </h1>
            <p className="text-xs text-slate-400">Trình giám sát truy xuất dữ liệu, điểm số Reranker & Trạng thái API Key Pool</p>
          </div>
        </div>

        <button
          onClick={() => fetchDebugInfo(query)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Tải lại Debug
        </button>
      </div>

      {/* Test Query Bar */}
      <form onSubmit={handleTestSearch} className="flex gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập câu hỏi test truy xuất RAG (Ví dụ: Cửa gỗ công nghiệp HDF, Thông số EA55...)"
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 text-slate-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
        >
          Chạy Test Retrieval
        </button>
      </form>

      {/* Key Pool Health Monitor */}
      {debugData?.keyPoolStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(debugData.keyPoolStats).map(([provider, stats]: [string, any]) => (
            <div key={provider} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>{provider}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-xl font-black text-slate-100">{stats.activeKeys} / {stats.totalKeys} Keys</div>
              <div className="text-[11px] text-slate-400">Cooldown: {stats.cooldownKeys} keys</div>
            </div>
          ))}
        </div>
      )}

      {/* Retrieval Debug Content */}
      {details ? (
        <div className="space-y-6">
          {/* Query Expansion & Confidence Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" /> Mở Rộng Truy Vấn (Query Expansion)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {details.expandedQueries?.map((eq: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 bg-blue-950 text-blue-300 text-xs rounded-lg border border-blue-800/50">
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" /> Độ Tin Cậy Reranker (Confidence)
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-emerald-400">{((details.confidenceScore || 0) * 100).toFixed(0)}%</span>
                {details.isLowConfidence ? (
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-400 text-xs font-bold rounded-lg border border-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Dưới 75% (Low)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Đạt Tiêu Chuẩn (High)
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-400" /> Số Lượng Đoạn Đã Chọn
              </div>
              <div className="text-xl font-bold text-slate-200">
                Top 20 candidates ➔ <strong className="text-blue-400">{details.top8Candidates?.length || 0} Chunks Reranked</strong>
              </div>
            </div>
          </div>

          {/* Top Candidates Table */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" /> Top Đoạn Dữ Liệu Được Chọn (Top Chunks & Scores)
            </h3>
            <div className="space-y-3">
              {details.top8Candidates?.map((chunk: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-400">#{idx + 1} Candidate ({chunk.source || 'hybrid'})</span>
                    <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 rounded-full font-bold">
                      Score: {((chunk.score || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    {chunk.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-800">
          Chưa có dữ liệu Debug. Hãy nhập câu hỏi test ở trên để xem chi tiết RAG Pipeline!
        </div>
      )}
    </div>
  );
}
