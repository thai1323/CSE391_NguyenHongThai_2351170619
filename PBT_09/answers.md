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

## PHẦN C — DEBUG & PHÂN TÍCH 

### Câu C1 — Debug DOM Code
# BÁO CÁO BÀI TẬP: CÂU C1 — DEBUG DOM CODE

## 1. Bảng phân tích chi tiết các lỗi sai đã tìm thấy (Tìm thấy 8 lỗi)

| STT | Dòng lệnh lỗi gốc | Bản chất và nguyên nhân gây lỗi | Giải pháp khắc phục cụ thể |
| :--- | :--- | :--- | :--- |
| **1** | `.addEventListener("onclick", ...)` | **Sai tên sự kiện:** Khi sử dụng phương thức `addEventListener`, tên sự kiện truyền vào bắt buộc phải bỏ tiền tố `on`. | Đổi chuỗi `"onclick"` thành `"click"`. |
| **2** | `countDisplay = count;` *(Nút Reset)* | **Lỗi ghi đè tham chiếu hằng số:** Lệnh này cố tình gán một con số thô (`0`) đè lên biến hằng `countDisplay`, làm mất liên kết đến thẻ HTML DOM và gây lỗi hệ thống ở các lượt bấm sau. | Sửa thành `countDisplay.textContent = count;`. |
| **3** | `historyList.innerHTML = null;` | **Sai kiểu dữ liệu gán cho DOM:** Gán giá trị `null` vào `innerHTML` là sai quy chuẩn hiển thị giao diện. Để xóa trắng một khối nội dung, ta cần dùng chuỗi rỗng. | Sửa thành `historyList.innerHTML = "";`. |
| **4** | `item.remove;` *(Nút Clear All)* | **Thiếu cú pháp gọi hàm:** `remove` là một phương thức xử lý (Method) của phần tử DOM. Nếu thiếu cặp dấu ngoặc `()`, trình duyệt sẽ bỏ qua và không thực thi hành động xóa. | Sửa thành `item.remove();`. |
| **5** | `countDisplay.innerHTML = count;` | **Vấn đề bảo mật và hiệu năng:** Biến `count` chỉ là một con số/ký tự thô (Plain Text). Việc lạm dụng `innerHTML` ép trình duyệt phải chạy bộ Parser lãng phí và dễ tạo lỗ hổng bảo mật không đáng có. | Thay thế toàn bộ bằng thuộc tính `.textContent`. |
| **6** | `count = localStorage.getItem(...)` | **Sai lệch kiểu dữ liệu (Type Mutation):** Dữ liệu nạp từ `localStorage` luôn trả về dạng **Chuỗi (String)**. Nếu để nguyên, phép toán `count++` ở các dòng trên sẽ bị hiểu nhầm thành phép nối chuỗi (Ví dụ: `"0" + 1 = "01"`). | Ép kiểu chuỗi về số nguyên bằng hàm `parseInt()`. |
| **7** | `count` nhận giá trị `null` khi chạy lần đầu | **Cạm bẫy dữ liệu trống (Nullish Bug):** Ở lần đầu tiên người dùng truy cập trang, `localStorage` hoàn toàn trống rỗng nên hàm `getItem` trả về `null`. Nếu cố tình gán và hiển thị, màn hình sẽ bị hiện chữ `NaN` hoặc `null`. | Sử dụng toán tử điều kiện để đặt giá trị mặc định bằng số `0` nếu dữ liệu trống. |
| **8** | `localStorage.setItem("history", ...)` | **Giao diện bất đồng bộ (Event Listener Loss):** Lưu toàn bộ chuỗi HTML thô từ `historyList.innerHTML` vào bộ nhớ sẽ làm mất sạch các trình lắng nghe sự kiện (`deleteHistory`) đã gắn vào các thẻ `<li>` cũ khi trang web được tải lại. | Giữ nguyên việc lưu chuỗi HTML nhưng thay đổi giải pháp nạp bằng kỹ thuật **Event Delegation** (Ủy quyền sự kiện) trực tiếp trên thẻ cha `#history`. |

---

## 2. Mã nguồn hoàn chỉnh sau khi vá lỗi và tối ưu hóa

```javascript
// Khởi tạo và truy vấn các phần tử DOM cốt lõi
const countDisplay = document.querySelector(".count");
const historyList = document.getElementById("history");

// Trạng thái ứng dụng (State): Đảm bảo luôn luôn là kiểu dữ liệu Số (Number)
let count = 0;

/**
 * Kỹ thuật Event Delegation (Ủy quyền sự kiện): Lắng nghe sự kiện click từ thẻ cha #history.
 * Giải pháp này giúp xử lý việc xóa phần tử LI cho cả các phần tử tạo mới HOẶC các phần tử 
 * cũ được nạp lại từ localStorage mà không bao giờ lo bị mất Event Listener.
 */
historyList.addEventListener("click", function(e) {
    if (e.target && e.target.nodeName === "LI") {
        deleteHistory(e.target);
    }
});

// 1. Xử lý sự kiện nút TĂNG (Increment)
document.querySelector("#incrementBtn").addEventListener("click", function() {
    count++;
    countDisplay.textContent = count; // Đã sửa: Dùng textContent an toàn, tối ưu hiệu năng
    
    // Tạo phần tử lịch sử mới
    const li = document.createElement("li");
    li.textContent = "Count changed to " + count;
    historyList.append(li);
});

// 2. Xử lý sự kiện nút GIẢM (Decrement)
document.querySelector("#decrementBtn").addEventListener("click", function() { // Đã sửa: "onclick" -> "click"
    count--;
    countDisplay.textContent = count; // Đã sửa: Thay thế bằng textContent
});

// 3. Xử lý sự kiện nút LÀM MỚI (Reset)
document.querySelector("#resetBtn").addEventListener("click", () => {
    count = 0;
    countDisplay.textContent = count; // Đã sửa: Tránh đè biến hằng hỏng cấu trúc DOM
    historyList.innerHTML = "";       // Đã sửa: Dùng chuỗi rỗng thay vì gán giá trị null
});

// Hàm hỗ trợ xóa một phần tử lịch sử cụ thể
function deleteHistory(element) {
    element.remove(); // Tối ưu: Dùng thẳng phương thức hiện đại .remove() gọn gàng hơn parentNode
}

// 4. Xử lý sự kiện nút XÓA TẤT CẢ LỊCH SỬ (Clear All)
document.querySelector("#clearHistory").addEventListener("click", () => {
    const items = historyList.querySelectorAll("li");
    items.forEach(item => {
        item.remove(); // Đã sửa: Thêm cặp dấu ngoặc tròn () để kích hoạt chạy hàm
    });
});

// 5. Đồng bộ hóa Lưu trữ trạng thái vào localStorage khi người dùng rời trang
window.addEventListener("beforeunload", () => {
    localStorage.setItem("count", count);
    localStorage.setItem("history", historyList.innerHTML);
});

// 6. Nạp và phục hồi trạng thái từ localStorage khi trang tải xong (Khởi tạo App)
window.addEventListener("load", () => {
    // Đã sửa: Bắt bẫy dữ liệu mặc định ban đầu nếu null và ép kiểu chuỗi về số nguyên hoàn chỉnh
    const savedCount = localStorage.getItem("count");
    count = savedCount !== null ? parseInt(savedCount, 10) : 0;
    countDisplay.textContent = count;

    // Phục hồi lại chuỗi danh sách lịch sử cũ
    const savedHistory = localStorage.getItem("history");
    if (savedHistory !== null) {
        historyList.innerHTML = savedHistory;
    }
});

