**PHẦN A — KIỂM TRA ĐỌC HIỂU**
**Câu A1 — Viewport & Mobile-First**
1. Thẻ <meta name="viewport"> chuẩn và giải thích thuộc tính
Cú pháp chuẩn bắt buộc phải khai báo trong thẻ <head> của mọi tài liệu HTML5:
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
Giải thích:
   name="viewport": Chỉ thị cho trình duyệt biết thẻ này dùng để cấu hình vùng hiển thị (viewport) của thiết bị di động.
   width=device-width: Ép chiều rộng của trang web phải tự động co giãn bằng khít với chiều rộng thực tế của màn hình thiết bị (độ phân giải CSS pixel chứ không phải pixel phần cứng), thay vì giả lập độ phân giải của máy tính.
   initial-scale=1.0: Thiết lập tỷ lệ thu phóng (zoom) ban đầu là $1:1$ ngay khi trang web vừa tải xong. Nó ngăn chặn việc trình duyệt tự động thu nhỏ giao diện khi người dùng truy cập bằng điện thoại.
2. Nếu THIẾU thẻ này, iPhone sẽ hiển thị trang web như thế nào?
Nếu không khai báo thẻ <meta viewport>, các thiết bị di động (như iPhone, iPad hay Android) sẽ rơi vào cơ chế tương thích ngược (Desktop Fallback):
   Hành vi hiển thị: iPhone sẽ mặc định coi trang web của bạn là giao diện dành riêng cho máy tính và tự động thiết lập một vùng hiển thị ảo rộng cố định khoảng 980px (hoặc 1024px).
   Hệ quả trên màn hình: Trình duyệt Safari trên iPhone sẽ bóp nhỏ toàn bộ trang web lại (Scale down) cho vừa vặn với chiều ngang của chiếc màn hình nhỏ xíu. Điều này khiến chữ (text) trở nên bé tí như kiến bò, các nút bấm quá nhỏ không thể chạm ngón tay chính xác và người dùng bắt buộc phải dùng 2 ngón tay để phóng to, kéo qua kéo lại vô cùng bất tiện.
3. Phân biệt Mobile-First và Desktop-First
Mobile-First
Bản chất: Viết CSS cho màn hình nhỏ nhất (Điện thoại) trước, sau đó dùng min-width để bù đắp thuộc tính cho màn hình lớn hơn.
Loại Media Query: Sử dụng min-width (Áp dụng từ mốc này trở lên).
Desktop-First
Bản chất: Viết CSS cho màn hình lớn nhất (Máy tính) trước, sau đó dùng max-width để tinh chỉnh thu nhỏ cho điện thoại.
Loại Media Query: Sử dụng max-width (Áp dụng từ mốc này trở xuống).
Ví dụ minh họa CSS với Breakpoint 768px:
Cách 1: Mobile-First (Dùng min-width)

body {
    background-color: lightblue;
    font-size: 14px;
}

@media (min-width: 768px) {
    body {
        background-color: lightgreen;
        font-size: 16px;
    }
}
Cách 2: Desktop-First (Dùng max-width)

body {
    background-color: lightgreen;
    font-size: 16px;
}

@media (max-width: 768px) {
    body {
        background-color: lightblue;
        font-size: 14px;
    }
}
4. Tại sao Mobile-First được khuyên dùng rộng rãi?
Tối ưu hóa hiệu năng (Performance): Thiết bị di động có cấu hình phần cứng yếu và tốc độ mạng 3G/4G/5G thường kém ổn định hơn máy tính cắm dây LAN. Viết code Mobile-First giúp trình duyệt di động tải ít code CSS nhất, bỏ qua các hiệu ứng nặng (như hover, hiệu ứng 3D chuyển động nặng của desktop), giúp trang web tải cực nhanh trên điện thoại.
Xu hướng thiết kế hiện đại (UX/UI): Ngày nay, lượng người dùng lướt web bằng điện thoại di động chiếm từ 60% - 80% tổng lượng truy cập toàn cầu. Thiết kế giao diện gọn gàng cho màn hình nhỏ giúp lập trình viên chắt lọc được những nội dung tinh túy và quan trọng nhất của dịch vụ.
Ưu tiên từ Google (SEO): Google áp dụng thuật toán Mobile-First Indexing. Nghĩa là Google sẽ dùng giao diện phiên bản di động của trang web để thu thập dữ liệu và đánh giá thứ bạng xếp hạng trên thanh tìm kiếm. Web không chuẩn mobile sẽ bị tụt hạng thê thảm.
**Câu A2 — Breakpoints**
Mức mặc định (Extra small - xs): Kích thước dưới 576px
    Thiết bị đại diện: Điện thoại di động dọc (iPhone 13/14/15, Samsung Galaxy...).
    Số cột hiển thị: 1 cột. Các card sản phẩm xếp chồng dọc, tràn viền màn hình để người dùng dễ lướt bằng một ngón tay.
Mức nhỏ (Small - sm): Kích thước từ 576px đến dưới 768px
    Thiết bị đại diện: Điện thoại di động xoay ngang hoặc máy tính bảng cỡ nhỏ (iPad Mini cỡ cũ).
    Số cột hiển thị: 2 cột. Tận dụng không gian bề ngang bắt đầu rộng ra để tăng mật độ hiển thị.
Mức trung bình (Medium - md): Kích thước từ 768px đến dưới 992px
    Thiết bị đại diện: Máy tính bảng hướng dọc (iPad Air, iPad Pro 11"...).
    Số cột hiển thị: 2 hoặc 3 cột (Chọn 2 cột nếu trang web có thanh Sidebar bộ lọc ở bên cạnh, chọn 3 cột nếu trang chỉ hiển thị toàn sản phẩm).
Mức lớn (Large - lg): Kích thước từ 992px đến dưới 1200px
    Thiết bị đại diện: Máy tính bảng nằm ngang, Laptop màn hình nhỏ (MacBook Air 13").
    Số cột hiển thị: 3 hoặc 4 cột. Đây là không gian lý tưởng nhất cho các lưới bán hàng e-commerce tiêu chuẩn.
Mức rất lớn (Extra large - xl): Kích thước từ 1200px đến dưới 1400px
    Thiết bị đại diện: Màn hình máy tính để bàn (Desktop), Laptop cỡ lớn (15.6" - 16").
    Số cột hiển thị: 4 cột. Đảm bảo giao diện thông thoáng, hiển thị đầy đủ chi tiết sản phẩm.
Mức siêu lớn (Extra extra large - xxl): Kích thước từ 1400px trở lên
    Thiết bị đại diện: Màn hình PC kích thước lớn, độ phân giải cao hoặc màn hình siêu rộng (Ultrawide).
    Số cột hiển thị: 5 hoặc 6 cột. Việc tăng số cột giúp bao phủ hết các khoảng trống dư thừa và giữ cho các card sản phẩm không bị kéo giãn quá to làm vỡ layout.
**Câu A3 — Media Queries**
Màn hình 375px (iPhone SE): Chiều rộng .container là 100%
    Giải thích: Kích thước màn hình này nhỏ hơn mốc tối thiểu 576px của tất cả các câu lệnh điều kiện. Do đó, phần tử sẽ không kích hoạt bất kỳ Media Query nào mà giữ nguyên giá trị thuộc tính mặc định được khai báo ban đầu ở ngoài cùng.
Màn hình 600px: Chiều rộng .container là 540px
    Giải thích: Kích thước này đã vượt qua mốc 576px nhưng vẫn chưa đạt tới mốc 768px. Trình duyệt sẽ chỉ kích hoạt duy nhất câu lệnh @media (min-width: 576px) và áp dụng độ rộng cố định tương ứng.
Màn hình 800px: Chiều rộng .container là 720px
    Giải thích: Màn hình 800px thỏa mãn cả hai điều kiện min-width: 576px và min-width: 768px. Theo quy tắc dòng chảy (Cascade) của CSS, trình duyệt đọc mã nguồn từ trên xuống dưới, câu lệnh nào viết sau sẽ có độ ưu tiên cao hơn, do đó giá trị 720px viết sau sẽ ghi đè hoàn toàn lên giá trị trước đó.
Màn hình 1000px: Chiều rộng .container là 960px
    Giải thích: Kích thước này lớn hơn mốc 992px nhưng vẫn nằm dưới mốc giới hạn kế tiếp là 1200px. Vì vậy, phần tử sẽ nhận giá trị thuộc tính nằm trong vùng điều kiện của mốc @media (min-width: 992px).
Màn hình 1400px: Chiều rộng .container là 1140px
    Giải thích: Đây là màn hình kích thước lớn, thỏa mãn toàn bộ các mốc điều kiện đã khai báo. Câu lệnh cuối cùng @media (min-width: 1200px) nằm ở vị trí dưới cùng trong file CSS nên nó giữ quyền ưu tiên cao nhất, quyết định độ rộng cố định cuối cùng của phần tử là 1140px.
**Câu A4 — SCSS Basics**
1. 4 tính năng chính của SCSS và ví dụ
Variables (Biến số)
    Giải thích: Cho phép lưu trữ các giá trị thường xuyên tái sử dụng (như mã màu, font chữ, kích thước margin/padding) vào một tên biến bắt đầu bằng dấu $. Khi cần thay đổi giao diện, bạn chỉ cần sửa giá trị tại một nơi duy nhất.
    Ví dụ:
        $primary-color: #2563eb;
        $font-base: 16px;

        button {
           background-color: $primary-color;
           font-size: $font-base;
        }
Nesting (Viết lồng nhau)
    Giải thích: Cho phép viết các bộ chọn CSS lồng vào nhau theo đúng cấu trúc hình cây của phân cấp HTML. Tính năng này giúp code gọn gàng hơn, tránh việc phải lặp đi lặp lại thẻ cha bên ngoài và dễ quản lý.
    Ví dụ:
        .navbar {
            background-color: #fff;
            .nav-links {
                display: flex;
                a {
                color: #333;
                &:hover { color: blue; } // Ký tự & đại diện cho chính thẻ a
                }
            }
        }
Mixins (@mixin và @include)
    Giải thích: Là các hàm dùng để đóng gói một nhóm các thuộc tính CSS lại với nhau, có khả năng truyền tham số (biến số) vào bên trong. Khi muốn tái sử dụng ở block khác, chỉ cần dùng lệnh @include.
    Ví dụ:
    @mixin flex-center($direction: row) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: $direction;
}

.hero {
    @include flex-center(column); // Gọi mixin và truyền tham số dọc
}
@extend / Inheritance (Kế thừa)
    Giải thích: Cho phép một bộ chọn CSS thừa hưởng (sao chép lại) toàn bộ các thuộc tính đã được định nghĩa của một bộ chọn khác. Trình duyệt khi biên dịch ra file CSS sẽ gộp các bộ chọn này lại với nhau thành một nhóm để tối ưu dung lượng file.
    Ví dụ:
    .btn-base {
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
}

.btn-success {
    @extend .btn-base; // Kế thừa toàn bộ thuộc tính của .btn-base
    background-color: green;
}
2. Tại sao trình duyệt KHÔNG đọc được file .scss? Cần bước gì để chuyển đổi?
Lý do: 
    Bản chất các trình duyệt web (như Chrome, Safari, Edge) chỉ được lập trình để hiểu và thông dịch mã nguồn CSS chuẩn (Vanilla CSS). Định dạng .scss chứa các cú pháp nâng cao (biến, lồng nhau, hàm...) nằm ngoài đặc tả kỹ thuật của W3C dành cho trình duyệt, nên nếu liên kết trực tiếp file .scss vào HTML, trình duyệt sẽ báo lỗi hoặc bỏ qua hoàn toàn.
Bước chuyển đổi (Biên dịch - Compilation):
    Để chạy được, bạn cần trải qua một bước gọi là Pre-processing (Tiền xử lý/Biên dịch) để dịch toàn bộ file .scss thành file .css thông thường.
Cách thực hiện thực tế: Bạn cần cài đặt và sử dụng các công cụ biên dịch như:
    Extension Live Sass Compiler ngay trong VS Code (phổ biến nhất khi học).
    Các gói lệnh Node.js như Sass (Dart Sass) chạy qua Terminal.
    Các công cụ đóng gói tự động trong dự án lớn như Vite, Webpack, hoặc Gulp.
    