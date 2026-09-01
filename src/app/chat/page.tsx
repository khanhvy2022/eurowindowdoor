import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ChatLayout } from '@/components/chat/ChatLayout';

export const metadata: Metadata = {
  title: 'AI Tư Vấn Cửa Eurowindow | Trợ lý ảo thông minh 24/7',
  description: 'Trợ lý AI tư vấn cấu hình, giải pháp cách âm, cách nhiệt, kỹ thuật cửa nhôm, cửa uPVC và vách kính Eurowindow.',
  keywords: [
    'AI tư vấn Eurowindow',
    'Trợ lý ảo Eurowindow',
    'Tư vấn kỹ thuật cửa nhôm',
    'Cấu hình cửa Eurowindow'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/chat',
  },
  openGraph: {
    title: 'AI Tư Vấn Cửa Eurowindow - Trợ Lý Ảo Thông Minh 24/7',
    description: 'Tư vấn trực tuyến giải pháp cửa và vật liệu xây dựng xanh Eurowindow.',
    url: 'https://eurowindowdoor.com/chat',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tư Vấn Cửa Eurowindow | Trợ lý ảo thông minh 24/7',
    description: 'Tư vấn trực tuyến giải pháp cửa và vật liệu xây dựng xanh Eurowindow.',
  },
};

export default async function ChatPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'true';

  return (
    <div className="w-full h-screen">
      <ChatLayout isAdmin={isAdmin} />
    </div>
  );
}
