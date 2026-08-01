# System Context

## Kiến trúc Hệ thống (System Architecture)

### 1. Chatbot RAG Pipeline (v2)
Quy trình xử lý của API `/api/chat/route.ts`:
1. **User Input**
2. **Intent Classifier & CCM (Orchestrator)**: Dùng Gemini flash để dịch câu hỏi (thêm context từ lịch sử) và phân loại ra 5 intent (showroom, technical, quote, warranty, general).
3. **Gateway Router**:
   - `Showroom`: Lấy dữ liệu tĩnh từ `src/data/showrooms.ts`.
   - `Quote`: Lấy dữ liệu tĩnh từ `src/app/bao-gia/pricing.ts`.
   - `Technical / Warranty`: Gọi Hybrid Graph RAG trong `src/lib/rag.ts` với Timeout 6s.
   - `General`: Đi thẳng tới LLM.
4. **Stream Text**: Dùng tính năng stream của AI SDK (`streamTextWithFallback`).
5. **Observability & Context Guard**: Hook vào sự kiện `onFinish` để validate kết quả ngầm (không chặn stream).

### 2. Dữ liệu (Database)
- **MongoDB**: Chứa `leads` (khách hàng tiềm năng, trích xuất tự động từ chat), `documents`, `document_chunks`.
- **Sandbox Files**: Tài liệu PDF/Word ở dạng file nội bộ, hỗ trợ bash_tool cho AI đọc trực tiếp.

### 3. Thành phần AI
- **Crawl4AI / LiteParse**: Trích xuất nội dung từ Web và PDF/Docx.
- **CodeGraph**: Phân tích quan hệ codebase nội bộ.

## Môi trường Triển khai
- Vercel (Hobby): Serverless function có maxDuration 60s. Front-end React timeout 12s, do đó RAG pipeline bắt buộc phải trả stream token đầu tiên trong dưới 10s.
