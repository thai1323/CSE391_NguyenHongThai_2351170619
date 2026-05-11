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
**Câu A2 — CSS Selectors — Dự đoán kết quả**
Kết quả dự đoán các phần tử được chọn từ đoạn mã HTML mẫu:
1. h1 → Chọn: ShopTLU

2. .price → Chọn: 25.990.000đ | 45.990.000đ

3. #app header → Chọn: Toàn bộ khối header chứa chữ ShopTLU và các liên kết Home, Products, About

4. nav a:first-child → Chọn: Home

5. .product.featured h2 → Chọn: MacBook Pro

6. article > p → Chọn: 25.990.000đ | Mô tả sản phẩm... (của iPhone 16) | 45.990.000đ | Mô tả sản phẩm... (của MacBook Pro)

7. a[href="/"] → Chọn: Home

8. .top-bar.dark h1 → Chọn: ShopTLU
**CÂU A4 — SPECIFICITY**
1. Tính Specificity Score (a, b, c) cho mỗi Rule
Công thức tính điểm ưu tiên (a, b, c) được quy ước như sau:
    a: Số lượng bộ chọn ID (trọng số cao nhất).
    b: Số lượng bộ chọn Class, Attribute, Pseudo-class.
    c: Số lượng bộ chọn Element (thẻ) và Pseudo-element.
Áp dụng vào các Rule:
Rule A (p): Chỉ có 1 thẻ p.
    Score: $(0, 0, 1)
Rule B (.price): Chỉ có 1 class .price.
    Score: $(0, 1, 0)
Rule C (#main-price): Chỉ có 1 ID #main-price.
    Score: $(1, 0, 0)
Rule D (p.price): Gồm 1 class .price và 1 thẻ p.
    Score: $(0, 1, 1)
2. Element sẽ có màu gì? Giải thích
Kết quả: Element sẽ có Màu đỏ (red).
Giải thích: * Trình duyệt sẽ so sánh điểm số từ trái qua phải (so sánh a trước, sau đó đến b, cuối cùng là c).
    Rule C (#main-price) có điểm số là (1, 0, 0) — sở hữu 1 bộ chọn ID (a=1).
    Điểm số này lớn hơn tất cả các Rule còn lại (Rule A: (0,0,1), Rule B: (0,1,0), Rule D: (0,1,1) đều có a=0). Do đó, Rule C thắng tuyệt đối.
3. Nếu thêm thuộc tính style trực tiếp (Inline CSS)
HTML <p class="price" id="main-price" style="color: orange;">
Kết quả: Element sẽ có Màu cam (orange).
Giải thích: * Inline CSS có điểm Specificity vượt trội hoàn toàn so với các bộ chọn trong file CSS bên ngoài (được quy ước thang điểm là (1, 0, 0, 0) với số đầu tiên đại diện cho Inline CSS).
Do đó, style trực tiếp sẽ ghi đè lên toàn bộ các rule A, B, C, D.
4. Nếu Rule A thêm !important
CSSp { color: black !important; } /* Rule A */
Kết quả: Element sẽ có Màu đen (black).
Giải thích: * Từ khóa !important không thuộc thang tính điểm Specificity thông thường mà nó là một chỉ thị đặc biệt, thiết lập mức độ ưu tiên tối cao trong CSS.
    Nó sẽ ghi đè lên mọi rule khác (kể cả ID selector có điểm cao như Rule C hay thậm chí là thuộc tính style màu cam ở câu trên). Do đó, Rule A giành chiến thắng.
**CÂU B2 — Box Model Lab**
PHẦN 1 — CHỨNG MINH CONTENT-BOX VS BORDER-BOX

1. Kết quả đo đạc từ trình duyệt (Chrome DevTools):
Hộp 1 (content-box): chiều rộng thực tế = 350px (đo từ DevTools)
Hộp 2 (border-box): chiều rộng thực tế = 300px (đo từ DevTools)

 2. Giải thích sự khác biệt:
Với Hộp 1 (`content-box`): Đây là cơ chế tính kích thước mặc định của trình duyệt. Thuộc tính `width: 300px` chỉ áp dụng riêng cho vùng chứa nội dung (Content). Chiều rộng thực tế hiển thị trên màn hình sẽ cộng thêm phần đệm và phần viền:
  $$\text{Chiều rộng thực tế} = \text{Width} + \text{Padding L/R} + \text{Border L/R}$$
  $$\text{Chiều rộng thực tế} = 300\text{px} + (20\text{px} \times 2) + (5\text{px} \times 2) = 350\text{px}$$
  Do đó, hộp bị phình to ra ngoài kích thước khai báo ban đầu.

Với Hộp 2 (`border-box`): Trình duyệt khóa chặt chiều rộng thực tế của hộp bằng đúng giá trị khai báo (`width: 300px`). Để làm được điều này, trình duyệt tự động ép/co nhỏ vùng chứa nội dung (Content) bên trong lại:
  $$\text{Content Width} = \text{Width khai báo} - \text{Padding L/R} - \text{Border L/R}$$
  $$\text{Content Width} = 300\text{px} - 40\text{px} - 10\text{px} = 250\text{px}$$
  Giúp kích thước tổng thể luôn cố định mượt mà ở mức 300px.
PHẦN 2 — PHÂN TÍCH LAYOUT 3 CỘT

1. Phân tích toán học (Tổng kích thước khi KHÔNG dùng `border-box`):
Nếu 3 cột sử dụng cơ chế mặc định `content-box`, kích thước thực tế hiển thị của từng cột sẽ bị phình ra do cộng dồn padding:
Cột trái: $\text{rộng} = 250\text{px} + (15\text{px} \times 2 \text{ padding}) = 280\text{px}$
Cột giữa: $\text{rộng} = 500\text{px} + (20\text{px} \times 2 \text{ padding}) = 540\text{px}$
Cột phải: $\text{rộng} = 250\text{px} + (15\text{px} \times 2 \text{ padding}) = 280\text{px}$

$$\text{Tổng chiều rộng thực tế} = 280\text{px} + 540\text{px} + 280\text{px} = 1100\text{px}$$

> Kết quả: Vì tổng thực tế ($1100\text{px}$) lớn hơn kích thước của Container ($1000\text{px}$), cột thứ ba (ads) sẽ không đủ chỗ trống để hiển thị trên cùng một hàng và ngay lập tức bị đẩy rơi xuống dòng dưới gây vỡ layout.

2. Khi sử dụng `border-box`:
Cả 3 cột tự động co vùng content bên trong lại để giữ nguyên kích thước bề ngoài đúng như khai báo ($250\text{px} + 500\text{px} + 250\text{px} = 1000\text{px}$). Do đó, layout 3 cột xếp thẳng hàng hoàn hảo và khít vừa vặn trong Container.