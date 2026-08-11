import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ChatLayout } from '@/components/chat/ChatLayout';

export const metadata: Metadata = {
  title: 'AI Tư Vấn Cửa | Trợ lý ảo thông minh',
  description: 'Chatbot AI tư vấn cấu hình, cách âm, cách nhiệt, kỹ thuật cửa nhôm, vách kính Eurowindow.',
  alternates: {
    canonical: 'https://eurowindowdoor.com/chat',
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
