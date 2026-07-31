'use client';

import React, { useRef, useState } from 'react';
import { Send, Paperclip, Loader2, FileText, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDFClient } from '@/lib/pdf-client';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>, data?: { fileName?: string; documentId?: string }) => void;
  isLoading: boolean;
  isAdmin?: boolean;
}

const MotionDiv = motion.div as any;

export function ChatInput({ input = '', setInput, handleSubmit, isLoading, isAdmin = false }: ChatInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        alert('Vui lòng chọn file PDF.');
        return;
      }
      
      setFile(selectedFile);
      setIsUploading(true);
      setUploadSuccess(false);

      try {
        let extractedText = '';
        let useClientSide = true;

        try {
          // 1. Try to extract text in the browser
          extractedText = await extractTextFromPDFClient(selectedFile);
          if (!extractedText || extractedText.trim() === '') {
            throw new Error('No text content found in PDF');
          }
        } catch (clientExtractError) {
          console.warn('Client-side PDF extraction failed, falling back to server upload:', clientExtractError);
          useClientSide = false;
        }

        let response: Response;

        if (useClientSide && extractedText) {
          // Send extracted text directly as JSON (no size limits!)
          response = await fetch('/api/upload-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: selectedFile.name,
              text: extractedText,
            }),
          });
        } else {
          // Fallback: Upload raw file (Vercel payload limit is 4.5MB, so only allowed for small files)
          if (selectedFile.size > 4 * 1024 * 1024) {
            throw new Error('File PDF quá lớn (vượt quá 4MB) và không thể trích xuất văn bản trong trình duyệt. Vui lòng giảm dung lượng file hoặc sử dụng file khác.');
          }

          const formData = new FormData();
          formData.append('file', selectedFile);
          response = await fetch('/api/upload-pdf', {
            method: 'POST',
            body: formData,
          });
        }

        const rawResponseText = await response.text();
        let data: any;
        try {
          data = JSON.parse(rawResponseText);
        } catch (jsonErr) {
          if (response.status === 413 || rawResponseText.includes('Payload Too Large') || rawResponseText.includes('Request Entity Too Large') || rawResponseText.includes('FUNCTION_PAYLOAD_TOO_LARGE')) {
            throw new Error('Dung lượng file quá lớn so với giới hạn của máy chủ. Vui lòng thử trích xuất text tự động hoặc dùng file nhỏ hơn.');
          }
          throw new Error(rawResponseText ? (rawResponseText.substring(0, 100) + '...') : 'Invalid response from server');
        }
        
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }
        
        if (data.documentId) {
          setDocumentId(data.documentId);
        }
        setUploadSuccess(true);
      } catch (error: any) {
        console.error('Error uploading file:', error);
        alert(`Lỗi khi tải file lên: ${error.message}`);
        setFile(null);
        setDocumentId(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() && !file) return;
      handleSubmit(undefined, { fileName: file?.name, documentId: documentId || undefined });
      setFile(null);
      setDocumentId(null);
      setUploadSuccess(false);
    }
  };

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {file && (
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-11 md:-top-12 left-0 right-0 flex items-center bg-white dark:bg-zinc-800 rounded-lg p-1.5 md:p-2 shadow-sm border border-zinc-200 dark:border-zinc-700 max-w-[280px] sm:max-w-sm"
          >
            <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-1.5 md:mr-2 shrink-0" />
            <span className="text-xs md:text-sm truncate flex-1">{file.name}</span>
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500 shrink-0" />
            ) : uploadSuccess ? (
              <div className="flex items-center gap-1 shrink-0">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setDocumentId(null); setUploadSuccess(false); }}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setFile(null); setDocumentId(null); }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </MotionDiv>
        )}
      </AnimatePresence>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() && !file) {
            return;
          }
          handleSubmit(e, { fileName: file?.name, documentId: documentId || undefined });
          setFile(null);
          setDocumentId(null);
          setUploadSuccess(false);
        }}
        className="relative flex items-center bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 rounded-2xl md:rounded-3xl shadow-sm px-1.5 md:px-2 py-1.5 md:py-2"
      >
        {isAdmin && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-3 text-zinc-400 hover:text-blue-500 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
              disabled={isLoading || isUploading}
            >
              <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
          </>
        )}
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi tôi về cửa Eurowindow..."
          className="flex-1 bg-transparent border-none outline-none resize-none px-2 md:px-4 py-2 md:py-3 max-h-32 text-sm md:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          rows={1}
          style={{ minHeight: '40px' }}
        />

        <button
          type="submit"
          disabled={isLoading || isUploading || (!input.trim() && !file)}
          className="p-2 md:p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
          ) : (
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
