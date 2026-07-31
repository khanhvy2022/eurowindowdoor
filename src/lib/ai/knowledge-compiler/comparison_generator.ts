export function generateComparison(docTitle: string): { comparisonMd: string } {
  const comparisonMd = `# Bảng So Sánh Đối Kháng Kỹ Thuật (Eurowindow vs Competitors) - ${docTitle}

> [!NOTE]
> Bảng so sánh dựa strictly trên thông số kỹ thuật công bố và tiêu chuẩn kiểm định độc lập. Các thông số chưa có kiểm định chính thức được đánh dấu là \`unknown\`.

| Tiêu chí kỹ thuật | Eurowindow (EA55 / EA60i) | Xingfa Quảng Đông (Nhập khẩu) | PMA | Topal |
| :--- | :--- | :--- | :--- | :--- |
| **Xuất xứ profile** | Đùn ép tiêu chuẩn Eurowindow / Kommerling CHLB Đức | Quảng Đông (Trung Quốc) | Việt Nam | Tập đoàn Austdoor (Việt Nam) |
| **Cầu cách nhiệt** | Có (Dải Polyamide 24mm trên dòng EA60i) | Không (Dòng 55 tiêu chuẩn) | Không | Dòng Slim / Prima không cầu |
| **Độ cách âm** | 38dB - 42dB (Đã kiểm định EN 12207) | ~30dB - 32dB | \`unknown\` | ~32dB |
| **Hệ gioăng** | EPDM cao cấp kép bọc kín chân cánh | Gioăng cao su thường / EPDM | Gioăng EPDM | Gioăng EPDM kép |
| **Bảo hành sơn** | AkzoNobel 10 - 20 năm chính hãng | 5 năm (Tùy đại lý phân phối) | 5 năm | 5 - 10 năm |
| **Phụ kiện đồng bộ** | Roto Frank (Đức), Winkhaus, Hopo, Eurowindow Metallic | Kinlong (Dễ bị hàng giả nái) | PMA / Kinlong | Topal đồng bộ |
| **Chống ngấm nước** | Keo ép góc bọt Foam + Ống thoát nước chìm | Keo nẹp / Ke ma nhảy | Ke ma nhảy | Ke ma nhảy ép góc |

## Tóm Tắt Điểm Mạnh Eurowindow
1. Khả năng chống ồn và cản nhiệt vượt trội nhờ tùy chọn nhôm cầu EA60i & uPVC Kommerling.
2. Phụ kiện Roto Frank nhập khẩu Đức đồng bộ 100%, bảo hành chính hãng không qua trung gian.
3. Keo foam đệm chân khung chống thấm tuyệt đối so với thi công keo nẹp thông thường.
`;

  return { comparisonMd };
}
