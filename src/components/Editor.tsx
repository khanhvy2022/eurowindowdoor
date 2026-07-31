'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Import react-quill dynamically with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p className="text-gray-500">Đang tải trình soạn thảo...</p> });

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Editor({ value, onChange, placeholder = 'Nhập nội dung bài viết...' }: EditorProps) {
  // Modules configuration for ReactQuill
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image', 'video'
  ];

  return (
    <div className="bg-white">
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="h-[400px] mb-12" // Leave margin at bottom because quill toolbar/editor adds height
      />
    </div>
  );
}
