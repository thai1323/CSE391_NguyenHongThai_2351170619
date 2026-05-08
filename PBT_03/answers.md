**PHẦN A — KIỂM TRA ĐỌC HIỂU**
**Câu A1 — 3 Cách nhúng CSS**
1. Inline CSS (Trực tiếp trong thẻ)
Ví dụ: <h1 style="color: blue; font-size: 20px;">Tiêu đề</h1>
Ưu điểm: Nhanh khi cần test; độ ưu tiên cao nhất giúp override (ghi đè) tức thì.
Nhược điểm: Không thể tái sử dụng; cực kỳ khó bảo trì khi dự án lớn; làm phình file HTML.
Khi nào dùng: Cần override khẩn cấp, viết CSS động bằng JavaScript, hoặc thiết kế HTML Email.
2. Internal CSS (Trong thẻ <style>)
Ví dụ: Viết trong thẻ <style> đặt ở <head> của file HTML:
<style>
  h1 { color: blue; }
</style>
Ưu điểm: Quản lý tập trung tại một nơi trong file; sử dụng được mọi bộ chọn (selectors) phức tạp.
Nhược điểm: Chỉ có tác dụng trên đúng 1 trang đó; không tái sử dụng được cho trang khác.
Khi nào dùng: Làm bản chạy thử nhanh (Prototype), hoặc trang đơn lẻ độc lập (Landing Page).
3. External CSS (File .css riêng biệt)
Ví dụ: Liên kết file styles.css bên ngoài thông qua thẻ <link> ở <head>:
<link rel="stylesheet" href="styles.css">
Ưu điểm: Trình duyệt cache giúp tải trang nhanh hơn; sửa 1 nơi thay đổi toàn bộ website; tách biệt code HTML và CSS.
Nhược điểm: Tạo thêm một yêu cầu tải file (HTTP request) trong lần đầu tiên truy cập.
Khi nào dùng: Chuẩn bắt buộc cho mọi dự án thực tế (Production).
CÂU HỎI THÊM:
Nếu áp dụng đồng thời cả 3 cách cho cùng 1 phần tử: Inline CSS sẽ "THẮNG".
Giải thích:Độ ưu tiên (Specificity): Trình duyệt chấm điểm ưu tiên cho Inline CSS là cao nhất ($1000$ điểm), vượt trội hoàn toàn so với Internal và External CSS (chỉ khoảng $1 - 100$ điểm tùy bộ chọn).
Nếu so sánh Internal và External CSS: Do hai cách này có độ ưu tiên ngang nhau, quy tắc Cascade (Dòng chảy từ trên xuống) sẽ quyết định: Style nào được trình duyệt đọc sau (nằm ở dòng dưới trong file HTML) sẽ ghi đè và thắng style viết trước.