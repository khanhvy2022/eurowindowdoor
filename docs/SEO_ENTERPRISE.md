# AI SEO Enterprise Platform Documentation — Eurowindownew

## Tổng quan
Module **AI SEO Enterprise Platform** tích hợp trực tiếp vào hệ thống quản trị `/admin/seo` của dự án Eurowindownew.

---

## Kiến trúc Hệ thống

### 1. Service Layer (`src/lib/seo/`)
- `audit.ts`: Động cơ AI Technical Audit (crawl HTML, phát hiện 30+ chỉ số, sinh priority checklist via Gemini)
- `content-audit.ts`: Đánh giá chất lượng nội dung, E-E-A-T, Helpful Content, Spam Risk
- `keyword.ts`: AI Keyword Research, clustering, search intent classification
- `schema-generator.ts`: Sinh JSON-LD Schema (Product, Article, FAQ, Organization, LocalBusiness, Breadcrumb, HowTo, Service)
- `internal-link.ts`: Phân tích liên kết nội bộ, orphan pages, gợi ý anchor text
- `crawl-engine.ts`: SEO Crawl Engine tích hợp Crawl4AI REST client, sitemap parser & MongoDB cache
- `site-health.ts`: Kiểm tra sức khỏe kỹ thuật (SSL, Sitemap, Robots.txt, Redirect chains)
- `geo.ts`: Generative Engine Optimization — đánh giá hiển thị thương hiệu trên các AI engines (Gemini, Groq, OpenRouter)
- `search-console.ts`: Tích hợp dữ liệu Google Search Console (Phase 1 structure + Phase 2 OAuth ready)
- `competitor.ts`: Phân tích đối thủ cạnh tranh bằng AI (strengths, weaknesses, opportunities)
- `content-generator.ts`: Động cơ sinh nội dung chuẩn SEO grounding 100% từ dữ liệu RAG Eurowindow
- `report.ts`: Xuất báo cáo định kỳ (Weekly, Monthly, Quarterly) dạng JSON & CSV/Excel
- `queue.ts`: Queue xử lý tác vụ nền dựa trên MongoDB (nâng cấp từ Redis/Bull)
- `score.ts`: Động cơ tính điểm SEO tổng hợp (Technical, Content, Performance, Mobile, Accessibility)

### 2. Database Layer (`src/models/`)
- `SeoAudit.ts`: Lưu lịch sử Technical Audit
- `SeoJob.ts`: Queue quản lý công việc nền
- `SeoKeyword.ts`: Lưu kết quả phân tích từ khóa
- `SeoReport.ts`: Lưu báo cáo SEO đã tạo

### 3. API Routes (`src/app/api/admin/seo/`)
- Tất cả API routes được bảo vệ bằng JWT Admin Auth Cookie (`verifyToken`)

---

## Giao diện Admin (`/admin/seo`)
- `/admin/seo/dashboard`: Tổng quan SEO Score, Core Web Vitals, GSC Trend, Site Health
- `/admin/seo/audit`: Tool Audit kỹ thuật URL
- `/admin/seo/content`: Tool Audit nội dung & E-E-A-T
- `/admin/seo/keywords`: Tool nghiên cứu & nhóm từ khóa
- `/admin/seo/internal-links`: Phân tích liên kết nội bộ
- `/admin/seo/schema`: Động cơ tạo mã JSON-LD Schema
- `/admin/seo/search-console`: Báo cáo Google Search Console
- `/admin/seo/geo`: Đánh giá GEO AI Visibility
- `/admin/seo/competitor`: Phân tích đối thủ cạnh tranh
- `/admin/seo/content-gen`: Trình sinh nội dung chuẩn SEO từ RAG
- `/admin/seo/reports`: Trung tâm xuất báo cáo
- `/admin/seo/assistant`: Trợ lý AI tư vấn SEO Enterprise (streaming chat)
