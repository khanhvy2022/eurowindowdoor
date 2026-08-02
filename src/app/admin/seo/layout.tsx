'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SEO_NAV = [
  { label: '📊 Dashboard SEO',      href: '/admin/seo/dashboard' },
  { label: '🔍 Technical Audit',    href: '/admin/seo/audit' },
  { label: '✍️ Content Audit',      href: '/admin/seo/content' },
  { label: '🔑 Keyword Research',   href: '/admin/seo/keywords' },
  { label: '🔗 Internal Links',     href: '/admin/seo/internal-links' },
  { label: '🏷️ Schema Generator',   href: '/admin/seo/schema' },
  { label: '📈 Search Console',     href: '/admin/seo/search-console' },
  { label: '🤖 GEO Analysis',       href: '/admin/seo/geo' },
  { label: '🕵️ Competitor Analysis', href: '/admin/seo/competitor' },
  { label: '📝 Content Generator',  href: '/admin/seo/content-gen' },
  { label: '📄 Reports',            href: '/admin/seo/reports' },
  { label: '💬 SEO Assistant',      href: '/admin/seo/assistant' },
];

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* SEO Module Header */}
      <div className="bg-gradient-to-r from-[#005ba7] to-[#0077d9] rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚀</span>
          <div>
            <h1 className="text-xl font-black tracking-tight">AI SEO Enterprise Platform</h1>
            <p className="text-blue-100 text-xs mt-0.5">Phân tích · Tối ưu · Tăng trưởng · Eurowindow</p>
          </div>
        </div>
      </div>

      {/* SEO Sub-Navigation */}
      <nav className="flex flex-wrap gap-2">
        {SEO_NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              pathname.startsWith(item.href)
                ? 'bg-[#005ba7] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-[#005ba7] border border-gray-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
