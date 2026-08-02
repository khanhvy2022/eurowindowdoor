# SEO ENTERPRISE AUDIT REPORT — EUROWINDOWDOOR

**Ngày thực hiện:** 02/08/2026  
**Dự án:** Eurowindownew (Next.js 16 App Router)  
**Kiến trúc hệ thống:** Embedded Admin Module (`/admin/seo`)

---

## 1. Các thành phần đã tích hợp

Hệ thống AI SEO Enterprise đã được tích hợp hoàn chỉnh vào bảng quản trị `/admin/seo` bao gồm 12 phân hệ chính:

1. **SEO Dashboard (`/admin/seo/dashboard`)**: Hiển thị tổng quan điểm SEO Score, Core Web Vitals, chỉ số Google Search Console, snapshot sức khỏe kỹ thuật.
2. **AI Technical Audit (`/admin/seo/audit`)**: Tự động crawl HTML, phân tích 30+ tín hiệu kỹ thuật (Title, Meta, Heading, Image Alt, Canonical, OpenGraph, Schema, Indexing), tự động sinh Priority Checklist nhờ AI Gemini.
3. **AI Content Audit (`/admin/seo/content`)**: Phân tích E-E-A-T, Helpful Content Score, Readability, Spam Risk, Semantic SEO kết hợp kiểm tra grounding đối chiếu dữ liệu RAG Eurowindow.
4. **AI Keyword Research (`/admin/seo/keywords`)**: Phân cụm từ khóa (Keyword Clustering), phân loại Search Intent (Informational, Commercial, Transactional), phát hiện câu hỏi FAQs và Keyword Cannibalization.
5. **AI Internal Linking (`/admin/seo/internal-links`)**: Xây dựng đồ thị liên kết nội bộ, phát hiện trang mồ côi (Orphan Pages) và đề xuất Anchor Text tối ưu.
6. **Schema Generator (`/admin/seo/schema`)**: Sinh mã JSON-LD cho 9 loại Schema tiêu chuẩn (Organization, LocalBusiness, Product, Article, FAQPage, Breadcrumb, HowTo, Service, WebSite) kèm trình validate cấu trúc.
7. **Generative Engine Optimization - GEO (`/admin/seo/geo`)**: Đánh giá khả năng xuất hiện & trích dẫn thương hiệu Eurowindow trên các AI Search Engine (Gemini, Groq/LLama3, OpenRouter/Mistral).
8. **Google Search Console Integration (`/admin/seo/search-console`)**: Tích hợp báo cáo Clicks, Impressions, CTR, Position, Top Queries, Top Pages và Index Coverage.
9. **AI Competitor Analysis (`/admin/seo/competitor`)**: Crawl và so sánh điểm mạnh, điểm yếu, cơ hội vượt lên đối thủ cạnh tranh.
10. **AI Content Generator (`/admin/seo/content-gen`)**: Sinh bài viết Blog, FAQ, Landing Page, Product description, Meta Data grounded 100% từ tài liệu RAG Eurowindow đã xác thực (không bịa thông tin).
11. **Report Export Center (`/admin/seo/reports`)**: Xuất báo cáo SEO định kỳ (Hàng tuần, Hàng tháng, Hàng quý) dưới dạng file CSV/Excel và JSON.
12. **AI SEO Assistant (`/admin/seo/assistant`)**: Trợ lý AI hội thoại tư vấn chiến lược SEO theo thời gian thực (Streaming response với Vercel AI SDK + RAG context).

---

## 2. Thành phần tái sử dụng từ mã nguồn mở & thư viện hiện có

| Thành phần | Mã nguồn / Thư viện | Vai trò |
|---|---|---|
| **AI Framework** | `@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/react` | Kết nối Gemini 2.0 Flash Exp, Groq, OpenRouter và hỗ trợ streaming UI |
| **Crawl Engine** | `Crawl4AIClient` (Mã nguồn dự án) | Trích dẫn nội dung HTML/Markdown vàEvading anti-bot |
| **RAG Knowledge Base** | `src/lib/rag.ts` | Tái sử dụng `retrieveRelevantContext` và `expandQuery` cho Content Generator & Content Audit |
| **Database** | MongoDB Atlas (`mongoose`) + Supabase (`@supabase/supabase-js`) | Lưu trữ lịch sử Audit, Keyword research, Reports và Job Queue |
| **Authentication & RBAC** | `jose` (JWT) + `src/middleware.ts` | Bảo mật toàn bộ API routes `/api/admin/seo/*` |
| **Biểu đồ Analytics** | `recharts` | Render biểu đồ xu hướng Clicks, Impressions, Position |
| **Xuất file** | `xlsx`, `date-fns` | Xử lý ngày tháng và đóng gói file xuất báo cáo |

---

## 3. Thành phần tự phát triển (Custom Developed)

1. **`src/lib/seo/audit.ts`**: Động cơ parser HTML nguyên sinh kết hợp prompt AI để tự sinh checklist sửa lỗi kỹ thuật theo thứ tự ưu tiên (Priority 1..N).
2. **`src/lib/seo/schema-generator.ts`**: Bộ tạo JSON-LD Schema với cấu hình sẵn thông tin doanh nghiệp Eurowindow (Organization, ContactPoint, Social Links).
3. **`src/lib/seo/geo.ts`**: Module đánh giá điểm GEO (Generative Engine Optimization) độc quyền kiểm tra mức độ bao phủ tri thức (Knowledge Coverage, Entity Completeness) của thương hiệu trên nhiều LLMs.
4. **`src/lib/seo/queue.ts`**: Hệ thống hàng đợi tác vụ nền (Lightweight Job Queue) chạy trên MongoDB không phụ thuộc Redis/BullMQ.
5. **`src/lib/seo/content-generator.ts`**: Động cơ sinh nội dung rào chắn Hallucination — bắt buộc lấy ngữ cảnh từ RAG Supabase/MongoDB trước khi viết.
6. **`src/lib/seo/score.ts`**: Thuật toán chấm điểm SEO composite tổng hợp trọng số từ 5 nhóm chỉ số (Technical, Content, Performance, Mobile, Accessibility).

---

## 4. Các tính năng chưa triển khai & Lý do

| Tính năng | Trạng thái | Lý do tạm hoãn / Defer |
|---|---|---|
| **OAuth2 Real GSC API** | Phase 1 Mocking | Cần thông tin Google Search Console Client ID/Secret thực tế và xác minh quyền sở hữu Domain từ khách hàng. Cấu trúc dữ liệu đã được thiết kế sẵn sàng cho Phase 2 sync. |
| **Phân tích Backlink chuyên sâu** | Chưa triển khai | Các dịch vụ kiểm tra Backlink chất lượng (Ahrefs, Moz, Semrush) đều yêu cầu API Key trả phí đắt đỏ. Hệ thống hiện tập trung tối đa vào On-page & Technical SEO. |
| **Lighthouse Real RUM Audit** | Dùng chỉ số ước tính | Chạy Google Lighthouse thật trên Server yêu cầu Headless Chrome tốn rất nhiều RAM/CPU server. Hệ thống hiện ưu tiên Crawl4AI + HTML signal parser để không làm treo website. |

---

## 5. Đề xuất lộ trình phát triển tiếp theo (Roadmap)

### Giai đoạn 2 (Tháng tiếp theo):
* Tích hợp OAuth 2.0 thực tế cho Google Search Console API.
* Tích hợp Google PageSpeed Insights API (dùng API Key miễn phí của Google).
* Bổ sung tính năng Webhook thông báo tự động qua Telegram/Email khi điểm SEO rơi xuống dưới threshold (Ví dụ: Score < 50).

### Giai đoạn 3 (Dài hạn):
* Phát triển Cronjob tự động Crawl & Audit định kỳ hàng tuần.
* Tích hợp tính năng AI Auto-Fix (Tự động cập nhật Meta Title/Description trực tiếp vào cơ sở dữ liệu bài viết Next.js khi Admin bấm "Đồng ý").
* Mở rộng thêm tính năng kiểm tra chuẩn accessibility WCAG 2.2 cho giao diện người dùng.
