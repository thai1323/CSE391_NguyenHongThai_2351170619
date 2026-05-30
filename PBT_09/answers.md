## PHẦN A — KIỂM TRA ĐỌC HIỂU 

### Câu A1 — DOM Tree
1. Sơ đồ cây DOM (DOM Tree)
Cấu trúc phân cấp các nút phần tử (Element Nodes) trong cây DOM từ gốc #app được biểu diễn trực quan như sau:
┌─────────────────── document ───────────────────┐
       │                                                │
       ▼                                                ▼
┌─────────────┐                                  ┌─────────────┐
│  Text Node  │                                  │ Element Node│
│  (Whitespace)                                  │    <html>   │
└─────────────┘                                  └──────┬──────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │    <body>   │
                                                 └──────┬──────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │ div (#app)  │
                                                 └──────┬──────┘
                             ┌──────────────────────────┴──────────────────────────┐
                             ▼                                                     ▼
                      ┌─────────────┐                                       ┌─────────────┐
                      │   header    │                                       │    main     │
                      └──────┬──────┘                                       └──────┬──────┘
              ┌──────────────┴──────────────┐                       ┌──────────────┴──────────────┐
              ▼                             ▼                       ▼                             ▼
       ┌─────────────┐               ┌─────────────┐         ┌─────────────┐               ┌─────────────┐
       │     h1      │               │     nav     │         │ form(#todoForm)             │ ul(#todoList)
       └──────┬──────┘               └──────┬──────┘         └──────┬──────┘               └──────┬──────┘
              ▼                             │                       │                             │
       ┌─────────────┐       ┌──────────────┼──────────────┐        │                     ┌───────┴───────┐
       │  Text Node  │       ▼              ▼              ▼        │                     ▼               ▼
       │ "Todo App"  │   ┌───────┐      ┌───────┐      ┌───────┐    │                 ┌───────┐       ┌───────┐
       └─────────────┘   │ a(.active)   │   a   │      │   a   │    │                 │  li   │       │  li   │
                         └───┬───┘      └───┬───┘      └───┬───┘    │                 │(.todo-item)   │(.completed)
                             ▼              ▼              ▼        │                 └───┬───┘       └───┬───┘
                         ┌───────┐      ┌───────┐      ┌───────┐    │                     ▼               ▼
                         │ Text  │      │ Text  │      │ Text  │    │                 ┌───────┐       ┌───────┐
                         │ "All" │      │"Active"      │"Completed" │                 │ Text  │       │ Text  │
                         └───────┘      └───────┘      └───────┘    │                 │"Learn │       │"Learn │
                                                                    │                 │ HTML" │       │ CSS"  │
                                            ┌───────────────────────┴─────────────────┘       └───────┘
                                            ▼                                         ▼
                                     ┌─────────────┐                           ┌─────────────┐
                                     │    input    │                           │   button    │
                                     │(#todoInput) │                           └──────┬──────┘
                                     └─────────────┘                                  ▼
                                                                               ┌─────────────┐
                                                                               │  Text Node  │
                                                                               │   "Add"     │
                                                                               └─────────────┘

--

2. Danh sách câu lệnh Query Selector đáp ứng các yêu cầu

// 1. Chọn thẻ <h1>
const todoTitle = document.querySelector("#app header h1");
// Hoặc ngắn gọn hơn nếu h1 là duy nhất: document.querySelector("h1");

// 2. Chọn input trong form
const todoInput = document.querySelector("#todoForm #todoInput");
// Hoặc: document.querySelector("#todoForm input");

// 3. Chọn tất cả các phần tử có class là .todo-item (Dùng querySelectorAll để lấy danh sách)
const todoItems = document.querySelectorAll(".todo-item");

// 4. Chọn thẻ liên kết (link) đang có class active
const activeLink = document.querySelector("nav a.active");

// 5. Chọn thẻ <li> đầu tiên nằm bên trong danh sách #todoList
const firstTodoItem = document.querySelector("#todoList li:first-child");
// Hoặc đơn giản: document.querySelector("#todoList li"); (Vì querySelector luôn lấy phần tử đầu tiên thỏa mãn)

// 6. Chọn tất cả các thẻ liên kết <a> nằm trực thuộc bên trong thẻ <nav>
const navLinks = document.querySelectorAll("nav a");

## CÂU A2 — INNERHTML VS TEXTCONTENT & XSS SECURITY

---

## 1. Sự khác nhau giữa `innerHTML` và `textContent`

| Tiêu chí | `innerHTML` | `textContent` |
| :--- | :--- | :--- |
| **Bản chất xử lý** | Đọc hoặc ghi nội dung dưới dạng **mã HTML**. Trình duyệt sẽ phân tích (parse) các thẻ tag và render ra giao diện. | Đọc hoặc ghi nội dung thuần túy dưới dạng **văn bản thô (Raw Text)**. Mọi ký tự đặc biệt đều được hiển thị y hệt. |
| **Hiệu năng** | **Chậm hơn** vì trình duyệt phải chạy bộ phân tích mã HTML để chuyển đổi chuỗi thành các phần tử DOM thực tế. | **Nhanh hơn** vì trình duyệt chỉ việc gán hoặc lấy chuỗi văn bản thuần túy trực tiếp mà không cần phân tích. |
| **Mức độ bảo mật** | **Nguy hiểm** (Dễ bị tấn công XSS nếu dữ liệu đến từ phía người dùng nhập vào). | **Cực kỳ an toàn** (Mọi mã độc dạng thẻ tag đều biến thành chuỗi vô hại). |

###  Khi nào nên dùng mỗi cái?
* **Dùng `innerHTML` khi:** Bạn chủ động tạo ra các đoạn mã HTML từ phía lập trình viên và muốn trình duyệt render ra giao diện (Ví dụ: Chèn một đoạn mã định dạng chữ đậm, chữ nghiêng `<span>Chào <b>Admin</b></span>`, hoặc chèn cấu trúc card sản phẩm).
* **Dùng `textContent` khi:** Bạn muốn hiển thị dữ liệu văn bản thông thường (Tên người dùng, nội dung tin nhắn, số dư tài khoản...) hoặc khi hiển thị bất kỳ dữ liệu nào do người dùng tự nhập từ ô `<input>`.

---

## 2. Câu hỏi bảo mật: Tại sao `innerHTML` gây lỗ hổng XSS?

### A. Giải thích nguyên nhân bản chất:
Lỗ hổng **XSS (Cross-Site Scripting)** xảy ra khi kẻ tấn công lừa trình duyệt thực thi các đoạn mã JavaScript độc hại trên máy của nạn nhân. 

Khi ta gán một chuỗi do người dùng nhập vào thuộc tính `innerHTML`, trình duyệt không thể phân biệt được đâu là mã code an toàn của nhà phát triển và đâu là mã do kẻ gian cố tình chèn vào. Trình duyệt sẽ lập tức thực thi bất kỳ thẻ `<script>` hoặc các thuộc tính bắt sự kiện lỗi (như `onerror`, `onload`) có chứa JavaScript độc hại nằm trong chuỗi đó.

### B. Minh họa kịch bản tấn công:

```javascript
// Kịch bản: User nhập mã độc vào ô input search nhằm kích hoạt sự kiện onerror của ảnh lỗi
const userInput = `<img src="link_anh_loi_chac_chan_vỡ.jpg" onerror="alert('Hacked! Keylogger đã được cài để cắp mật khẩu!')">`;

// Gán trực tiếp qua innerHTML:
document.querySelector("#result").innerHTML = userInput;  // ❌ CỰC KỲ NGUY HIỂM!

// Hệ quả: Trình duyệt tải ảnh lỗi -> Kích hoạt hàm onerror -> Đoạn mã JavaScript độc hại tự động chạy ngầm trên trình duyệt của nạn nhân.
--
## 3. Giải pháp khắc phục và sửa đổi code an toàn
Để vá lỗ hổng này, quy tắc tối thượng là: Không bao giờ tin tưởng dữ liệu của người dùng cung cấp. Chúng ta có 2 phương án xử lý triệt để:

Cách 1: Thay thế bằng textContent (Khuyên dùng tốt nhất cho Text thô)
Trình duyệt sẽ tự động mã hóa biến tất cả các ký tự < và > thành văn bản thuần túy (&lt; và &gt;), khiến thẻ <img> không thể chuyển hóa thành phần tử HTML.

// Đọc dữ liệu thô nhập vào từ ô input
const userInput = document.querySelector("#search").value;

// SỬA LẠI AN TOÀN: Sử dụng textContent thay vì innerHTML
document.querySelector("#result").textContent = userInput; 

// Kết quả hiển thị ra màn hình: Chuỗi "<img src=x onerror=...>" hiển thị như một dòng chữ bình thường, hoàn toàn vô hại.

Cách 2: Sử dụng các thư viện lọc sạch dữ liệu (Sanitization)
Nếu bắt buộc phải cho phép người dùng nhập mã HTML (Ví dụ: Người dùng viết bài bằng trình soạn thảo văn bản phong phú - Rich Text Editor), ta phải cho chuỗi chạy qua một bộ lọc để xóa bỏ hết mã Script độc hại trước khi gán vào innerHTML. Thư viện phổ biến nhất là DOMPurify:
// Nhúng thư viện DOMPurify, sau đó thực hiện lọc sạch (sanitize) trước khi gán
const userInput = document.querySelector("#search").value;

// Giữ lại các thẻ định dạng an toàn (b, i, strong) và bóc tách toàn bộ mã độc hại
const cleanInput = DOMPurify.sanitize(userInput);

document.querySelector("#result").innerHTML = cleanInput; 

## CÂU A3 — EVENT BUBBLING (SỰ KIỆN SỦI BỌT)

---

## 1. Dự đoán kết quả Output (Không chạy code)

Khi người dùng thực hiện hành động click vào phần tử `<button id="btn">`, kết quả in ra màn hình `console` trong 2 trường hợp sẽ như sau:

### Trường hợp 1: Khi dòng lệnh `e.stopPropagation();` vẫn bị KHÓA (Gốc)
```text
BUTTON
INNER
OUTER

### Trường hợp 2: Khi MỞ KHÓA (Bỏ comment) dòng lệnh e.stopPropagation();
BUTTON

2. Giải thích chi tiết bản chất cơ chế sủi bọt sự kiện
A. Tại sao trường hợp gốc lại in ra cả 3 từ theo thứ tự từ trong ra ngoài?
Cơ chế Event Bubbling (Sự kiện sủi bọt): Trong JavaScript DOM, khi một sự kiện (như click) xảy ra trên một phần tử, nó không chỉ kích hoạt riêng phần tử đó. Sự kiện sẽ tự động "sủi bọt" (chạy ngược lên trên) qua các phần tử cha, ông, tổ tiên của nó theo thứ tự cây gia phả cho đến khi chạm tới thẻ <html> và document.
Trình tự kích hoạt: Khi bạn click vào #btn (Target - Mục tiêu gốc):
   Trình duyệt thực thi callback của #btn đầu tiên $\rightarrow$ In ra BUTTON.
   Sự kiện sủi bọt lên phần tử cha trực tiếp là #inner $\rightarrow$ Kích hoạt lắng nghe và in ra INNER.
   Sự kiện tiếp tục sủi bọt lên phần tử cha tiếp theo là #outer $\rightarrow$ Kích hoạt lắng nghe và in ra OUTER.
B. Phương thức e.stopPropagation() có tác dụng gì?
   Bản chất kỹ thuật: Hàm stopPropagation() (Dừng lan truyền) có nhiệm vụ chặn đứng dòng chảy sủi bọt của sự kiện ngay tại vị trí nó được gọi. Nó dựng lên một "bức tường" ngăn không cho sự kiện lan lên các tầng cha phía trên.
   Hệ quả khi mở comment: Khi sự kiện click vừa chạm vào #btn, trình duyệt in ra chữ BUTTON và ngay lập tức va phải lệnh e.stopPropagation(). Sự kiện click bị triệt tiêu hoàn toàn ngay tại khối nút bấm. Do đó, cả hai phần tử #inner và #outer ở phía ngoài không hề nhận được tín hiệu click nào nữa, màn hình dừng lại và chỉ hiển thị duy nhất một dòng BUTTON.

