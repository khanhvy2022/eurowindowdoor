# Hướng dẫn Tính Báo giá Sơ bộ Cửa Eurowindow

Tài liệu này hướng dẫn cách tính báo giá sơ bộ cho khách hàng dựa trên dữ liệu giá tại `sandbox/data/pricing.ts`.

## 1. Công thức tính giá chung
- **Diện tích cửa (m2)** = Chiều rộng (m) * Chiều cao (m)
- **Diện tích tối thiểu để tính giá** là 1.0 m2 (nếu diện tích cửa < 1.0 m2, vẫn tính là 1.0 m2).
- **Thành tiền 1 bộ cửa** = Diện tích cửa tính giá * (Đơn giá cửa cơ bản/m2 + Đơn giá kính phụ trội/m2 + Đơn giá phụ kiện cửa/m2)
- **Tổng chi phí** = Thành tiền 1 bộ * Số lượng bộ

## 2. Các hệ cửa và cách tính cụ thể

### A. Hệ nhôm EA55 (Nhôm cao cấp không cầu cách nhiệt)
- **Đơn giá cơ bản**: Xem đối tượng `pricing.basePrice` trong `pricing.ts` (ví dụ: `mo_quay` là 5,000,000đ/m2, `truot` là 4,500,000đ/m2).
- **Kính phụ trội**: Xem đối tượng `pricing.glassExtra` (ví dụ: kính hộp `hop_5_9_5` là +400,000đ/m2, kính `low_e_6_9_6` là +1,000,000đ/m2).
- **Phụ kiện phụ trội**: Xem đối tượng `pricing.hardwareExtra` theo hãng phụ kiện (ví dụ: hãng C-Mech `cmech` cho cửa mở quay `mo_quay` là +1,000,000đ/m2, phụ kiện hãng Roto `roto` là +1,500,000đ/m2, phụ kiện Eurowindow `eurowindow` mặc định là 0đ).

### B. Hệ nhôm EA60i (Nhôm có cầu cách nhiệt cao cấp)
- **Đơn giá cơ bản**: Xem đối tượng `pricingEA60i.basePrice` (ví dụ: `mo_quay` là 10,000,000đ/m2).
- **Kính phụ trội**: Xem đối tượng `pricingEA60i.glassExtra` (ví dụ: kính hộp `hop_5_9_5` là +400,000đ/m2, kính Low-E là +1,000,000đ/m2).
- **Phụ kiện**: Đã được tính gộp trong đơn giá cơ bản.

### C. Hệ nhựa Kommerling uPVC (Cao cấp tiêu chuẩn châu Âu)
- **Đơn giá cơ bản**: Xem đối tượng `pricingKommerling.basePrice` (ví dụ: `cua_so_truot` là 4,500,000đ/m2, `cua_di_1_quay` là 7,000,000đ/m2).
- **Kính phụ trội**: Xem đối tượng `pricingKommerling.glassExtra` (ví dụ: `hop_5_9_5` là +400,000đ/m2).
- **Phụ kiện**: Đã được tính gộp trong đơn giá cơ bản.

### D. Hệ nhựa Asia uPVC (Kinh tế)
- **Đơn giá cơ bản**: Xem đối tượng `pricingAsia.basePrice`.
- **Kính phụ trội**: Xem đối tượng `pricingAsia.glassExtra`.
- **Phụ kiện**: Đã được tính gộp trong đơn giá cơ bản.

## 3. Quy trình báo giá của AI
Khi khách hàng yêu cầu báo giá sơ bộ:
1. Hỏi khách hàng các thông tin cần thiết: Hệ nhôm/nhựa mong muốn, loại cửa (mở quay/lùa/trượt/hất), loại kính, kích thước (rộng x cao), số lượng bộ.
2. Tra cứu file `sandbox/data/pricing.ts` để lấy giá chính xác.
3. Thực hiện tính toán chi tiết từng bước (ghi rõ diện tích cửa, đơn giá cơ bản, phụ trội kính, phụ trội phụ kiện).
4. Định dạng báo giá thành một bảng rõ ràng và tổng hợp thành tiền để gửi khách hàng.
