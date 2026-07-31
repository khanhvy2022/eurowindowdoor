export function generateSalesArgumentsAndQuestions(docTitle: string): {
  salesArgumentsMd: string;
  customerQuestionsMd: string;
} {
  const salesArgumentsMd = `# Luận Điểm Bán Hàng Thuyết Phục (Sales Arguments) - ${docTitle}

### 💡 Luận Điểm 1: Tiết Kiệm 30% Điện Năng Điều Hòa Hàng Tháng
- **Diễn giải:** Sử dụng nhôm cầu EA60i kết hợp kính hộp Low-E cản nhiệt giúp triệt tiêu hiện tượng bức xạ nóng mùa hè và giữ ấm mùa đông.
- **Giá trị khách nhận:** Chi phí tiền điện máy lạnh giảm từ 1.5 - 2 triệu/tháng cho toàn bộ căn biệt thự.

### 💡 Luận Điểm 2: Yên Tĩnh Tuyệt Đối Giữa Lòng Đô Thị Bận Rộn
- **Diễn giải:** Độ cách âm lên đến 42dB nhờ hệ gioăng EPDM kép và phụ kiện khóa đa điểm Roto siết chặt bọc kín mọi khe hở.
- **Giá trị khách nhận:** Giúp con trẻ tập trung học tập, người cao tuổi ngủ sâu giấc không bị giật mình bởi tiếng còi xe ngoài đường.

### 💡 Luận Điểm 3: Đầu Tư 1 Lần - Giá Trị Bền Vững 20+ Năm
- **Diễn giải:** Lớp sơn tĩnh điện AkzoNobel kháng muối biển không phai màu cùng hệ phụ kiện inox 304 không gỉ sét.
- **Giá trị khách nhận:** Không lo xệ cánh, kẹt khóa hay sơn xỉn màu phải thay mới sau vài năm như các loại nhôm phổ thông.
`;

  const customerQuestionsMd = `# Các Câu Hỏi & Thắc Mắc Thường Gặp Của Khách Hàng (Customer Questions) - ${docTitle}

### ❓ Khách hỏi: "Sao giá cửa Eurowindow cao hơn các đơn vị làm nhôm Xingfa trên thị trường?"
- **Cách phản hồi tư vấn:** 
  "Dạ thưa Anh/Chị, giá cửa Eurowindow bao gồm trọn gói profile độ dày tiêu chuẩn 1.4-2.0mm, hệ phụ kiện Roto Frank nhập khẩu Đức chính hãng 100% (không lo bị hàng nhái Kinlong trên thị trường), cùng công nghệ keo bọt Foam chống thấm chân tường. Anh/Chị đầu tư 1 lần dùng êm ái 20 năm mà không phát sinh chi phí sửa chữa hay thấm ngấm tường ạ."

### ❓ Khách hỏi: "Nhôm cầu cách nhiệt EA60i có thực sự cần thiết không hay dùng EA55 là đủ?"
- **Cách phản hồi tư vấn:**
  "Dạ nếu ô cửa của nhà mình ở vị trí hướng Tây chịu nắng chiếu trực tiếp chiều hoặc phòng ngủ mặt phố đường lớn, dòng EA60i sẽ giúp giảm 40% nhiệt và cản tiếng ồn tối đa. Còn với các hướng mát như hướng Đông hay cửa ban công sau, mình hoàn toàn dùng dòng EA55 để tối ưu chi phí ạ!"
`;

  return { salesArgumentsMd, customerQuestionsMd };
}
