'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    {
      label: '📊 Dashboard',
      href: '/admin/dashboard',
      active: pathname.includes('/dashboard'),
    },
    {
      label: '🧠 Nạp Tài Liệu AI (Knowledge Base)',
      href: '/admin/nap-tai-lieu',
      active: pathname.includes('/nap-tai-lieu'),
    },
    {
      label: '📦 Knowledge Compiler (Packs)',
      href: '/admin/knowledge',
      active: pathname.includes('/knowledge'),
    },
    {
      label: '📝 Quản lý Bài viết',
      href: '/admin/bai-viet',
      active: pathname.includes('/bai-viet'),
    },
    {
      label: '🚀 AI SEO Platform',
      href: '/admin/seo/dashboard',
      active: pathname.includes('/admin/seo'),
    },
    {
      label: '💬 Thử Nghiệm Chatbot AI',
      href: '/chat',
      active: pathname === '/chat',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <span className="text-xl font-bold">✕</span>
            ) : (
              <span className="text-xl font-bold">☰</span>
            )}
          </button>
          <Link href="/admin/dashboard" className="flex items-center gap-1.5">
            <span className="text-lg font-black text-[#005ba7] tracking-tight">Eurowindow</span>
            <span className="text-[10px] bg-blue-100 text-[#005ba7] px-1.5 py-0.5 rounded font-bold">Admin</span>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-red-600 font-bold px-2.5 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
        >
          Đăng xuất
        </button>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation (Desktop Persistent & Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out shadow-lg md:shadow-none ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#005ba7] tracking-tight">Eurowindow</h1>
            <p className="text-xs text-gray-500 font-medium">Hệ Thống Quản Trị AI Portal</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-gray-600 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                item.active
                  ? 'bg-[#005ba7] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2"
          >
            <span>🚪</span> Đăng xuất hệ thống
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}
