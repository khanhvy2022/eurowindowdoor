# Project Brief: Eurowindowdoor

## Mục tiêu Cốt lõi (Core Goals)
- Phát triển một AI Chatbot và hệ thống RAG Enterprise mạnh mẽ cho cửa hàng/công ty Eurowindow.
- Chatbot đóng vai trò như một chuyên gia tư vấn (Principal AI Architect & Sales), có thể báo giá, tra cứu đại lý, hỗ trợ kỹ thuật và thông tin bảo hành dựa trên tài liệu chính hãng.

## Nguyên tắc Thiết kế (Design Principles)
- **Độ trễ thấp (Low Latency)**: Tối ưu hóa API Route để vượt qua giới hạn Timeout 60s của Vercel Serverless.
- **Tính chính xác (Accuracy)**: Sử dụng kỹ thuật Hybrid Graph RAG kết hợp với Routing thông minh để điều hướng intent người dùng, hạn chế tối đa ảo giác (Hallucination).
- **Trí nhớ AI (Memory Bank)**: Đảm bảo AI luôn giữ được context thông qua hệ thống phân tích lịch sử, Context Manager và Memory Bank directory.

## Kiến trúc Tổng quan
- Frontend: Next.js (App Router), React, TailwindCSS.
- Database: MongoDB (lưu leads, documents), Supabase (nếu có sử dụng vector db khác).
- AI: Google Gemini (thông qua `@ai-sdk/google` và `openrouter`), Orchestrator 5 nhánh.
- Testing: Playwright E2E UI Testing.
