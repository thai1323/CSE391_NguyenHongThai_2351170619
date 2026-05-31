## PHẦN A — KIỂM TRA ĐỌC HIỂU 
### Câu A1 — Sync vs Async
1. Kết quả dự đoán thứ tự Output

Khi đoạn mã trên được thực thi, các dòng chữ sẽ in ra màn hình Console theo đúng thứ tự chính xác sau đây:

```text
1 - Start
4 - End
3 - Promise
6 - Promise 2
2 - Timeout 0ms
5 - Timeout 100ms
7 - Nested timeout

2. Giải thích cơ chế vận hành của JavaScript Engine

Để hiểu tại sao kết quả lại ra theo thứ tự trên, chúng ta cần phân tích 3 thành phần cốt lõi trong kiến trúc xử lý bất đồng bộ của JavaScript bao gồm: Event Loop, Microtask Queue, và Macrotask Queue (Task Queue).

A. Định nghĩa các khái niệm cốt lõi
Call Stack (Ngăn xếp tiếng gọi): Nơi chứa các dòng lệnh đồng bộ (Synchronous) đang được thực thi. JavaScript là ngôn ngữ đơn luồng (Single-threaded), nên tại một thời điểm Call Stack chỉ xử lý đúng một lệnh.

Microtask Queue (Hàng đợi siêu vi): Nơi lưu trữ các tác vụ bất đồng bộ có độ ưu tiên cao, phổ biến nhất là các callback của Promise.then(), catch(), finally(), hoặc MutationObserver.

Macrotask Queue / Task Queue (Hàng đợi tác vụ lớn): Nơi chứa các tác vụ bất đồng bộ có độ ưu tiên thấp hơn, bao gồm setTimeout, setInterval, các sự kiện UI (click, input), I/O, và các kỹ thuật Render đồ họa.

Event Loop (Vòng lặp sự kiện): Là một cơ chế giám sát liên tục. Quy tắc tối thượng của Event Loop là:

Bước 1: Kiểm tra xem Call Stack có trống không. Nếu có lệnh đồng bộ, giải quyết cho xong.

Bước 2: Khi Call Stack trống hoàn toàn, Event Loop sẽ quét qua Microtask Queue và thực thi TOÀN BỘ các tác vụ có trong đó cho đến khi sạch sẽ.

Bước 3: Sau khi Microtask Queue trống, Event Loop mới lấy ĐÚNG 1 tác vụ từ Macrotask Queue đẩy lên Call Stack để chạy, rồi quay lại Bước 2.

### Câu A2 — Fetch API
1. Giải thích chi tiết từng dòng code

async function getData() 
    Ý nghĩa: Định nghĩa một hàm bất đồng bộ tên là getData. Từ khóa async đặt trước hàm bắt buộc hàm này luôn luôn trả về một Promise. Nó cũng cho phép chúng ta sử dụng từ khóa await bên trong thân hàm.
try 
    Ý nghĩa: Mở đầu khối lệnh kiểm soát lỗi (try...catch). Tất cả các dòng code có nguy cơ xảy ra lỗi phát sinh khi kết nối hoặc xử lý dữ liệu sẽ được đặt trong khối try này.
const response = await fetch("https://api.example.com/data");
    Ý nghĩa: Kích hoạt một request gửi đến URL chỉ định. Hàm fetch bất đồng bộ sẽ được thực thi, và từ khóa await sẽ tạm dừng hàm getData cho đến khi Promise của fetch được giải quyết (resolved), sau đó gán kết quả là một đối tượng Response vào biến response.
if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    Ý nghĩa: Kiểm tra trạng thái phản hồi từ Server. Khác với các thư viện như Axios, fetch không tự động nhảy vào khối catch khi gặp lỗi HTTP (như 404 hay 500). Vì vậy, nếu thuộc tính ok là false (yêu cầu thất bại), chúng ta phải chủ động dùng lệnh throw new Error để ném ra một ngoại lệ kèm theo mã trạng thái (status code), ép chương trình nhảy xuống khối catch.
const data = await response.json();
    Ý nghĩa: Đọc luồng dữ liệu (Stream) từ body của phản hồi và chuyển đổi nó từ chuỗi văn bản JSON sang một đối tượng JavaScript (Object/Array). Quá trình đọc dữ liệu và chuyển đổi (parse) này là bất đồng bộ nên bắt buộc phải có từ khóa await.
return data;
    Ý nghĩa: Trả về kết quả dữ liệu đã được xử lý thành công. Khi hàm async trả về một giá trị, Promise đại diện cho hàm này sẽ chuyển sang trạng thái fulfilled với giá trị đó.
catch (error) 
    Ý nghĩa: Khối xử lý ngoại lệ. Nếu có bất kỳ lỗi nào xảy ra ở các dòng lệnh trong khối try phía trên, luồng chạy của chương trình sẽ lập tức nhảy xuống đây và gán đối tượng lỗi vào biến error.
console.error("Failed:", error.message);
return null;
    Ý nghĩa: In thông báo lỗi cụ thể ra màn hình Console của nhà phát triển để phục vụ debug, sau đó trả về null như một tín hiệu an toàn để báo cho các hàm gọi phía ngoài biết rằng tác vụ tải dữ liệu đã thất bại.

2.
a.
  fetch trả về gì: Hàm fetch() ngay khi được gọi sẽ trả về một Promise, mà khi hoàn thành (resolved), Promise đó sẽ chứa một đối tượng Response (đại diện cho toàn bộ phản hồi HTTP bao gồm Headers, Status, Cookies...).

  Tại sao cần await: Vì việc gửi yêu cầu qua internet và chờ Server phản hồi mất một khoảng thời gian (I/O bất đồng bộ). Nếu không có await, JavaScript (vốn chạy đồng bộ theo cơ chế non-blocking) sẽ không đợi kết quả mà chạy ngay xuống dòng tiếp theo, lúc này biến response sẽ chỉ là một Promise chưa hoàn thành (Pending), dẫn đến việc các dòng code bên dưới bị lỗi vì không thể đọc được thuộc tính .ok hay .json().
b.
  Khi nào false: Thuộc tính response.ok sẽ trả về false khi mã trạng thái HTTP (HTTP Status Code) của phản hồi nằm ngoài khoảng 200 - 299 (tức là không phải phản hồi thành công).

  3 status codes tương ứng làm response.ok bằng false:
  404 (Not Found - Không tìm thấy trang/tài nguyên).
  401 (Unauthorized - Chưa xác thực danh tính / thiếu Token).
  500 (Internal Server Error - Lỗi hệ thống từ phía máy chủ).
c.
  Khi Server bắt đầu phản hồi, hàm fetch hoàn thành ngay khi nhận được Headers của gói tin HTTP (để chúng ta kiểm tra .ok và .status). Tuy nhiên, phần thân dữ liệu (Body) của phản hồi lúc này có thể vẫn đang được tải về dưới dạng một luồng dữ liệu thô (ReadableStream).
  Phương thức response.json() đảm nhận hai việc: vừa đợi luồng dữ liệu (Stream) tải về trọn vẹn, vừa thực hiện giải mã (Parse) chuỗi JSON đó thành đối tượng JavaScript. Cả hai tác vụ này đều tốn thời gian và được thiết kế chạy bất đồng bộ, vì vậy nó tiếp tục trả về một Promise và bắt buộc phải có await lần hai để lấy được dữ liệu cuối cùng.
d. 
  Dựa trên cấu trúc của đoạn code đã cho, khối try...catch này sẽ bắt được các loại lỗi sau:
    Bắt được Network error (Lỗi mạng): CÓ. Nếu mất kết nối Internet, đứt cáp, DNS bị sai hoặc sai URL nghiêm trọng, hàm fetch() sẽ thất bại ngay lập tức và ném ra một TypeError: Failed to fetch. Lỗi này sẽ bị catch giữ lại.
    Bắt được lỗi HTTP 404 / 500: CÓ (Nhờ dòng code kiểm tra thủ công). Bản thân fetch không coi 404 hay 500 là lỗi kết nối nên nó không tự ném vào catch. Nhưng vì trong đoạn code có đoạn logic kiểm tra if (!response.ok) { throw new Error(...) }, lệnh throw này đã chủ động ném lỗi và biến khối catch trở thành nơi hứng lỗi 404 / 500.
    Bắt được JSON parse error (Lỗi cú pháp JSON): CÓ. Nếu Server phản hồi thành công (ví dụ mã 200) nhưng dữ liệu trả về lại là một chuỗi văn bản thuần (Plain Text), HTML (ví dụ trang báo lỗi của Nginx) hoặc chuỗi JSON bị lỗi cú pháp, phương thức response.json() sẽ không parse được và tự động ném ra một lỗi SyntaxError: Unexpected token.... Lỗi này sẽ bị khối catch tóm gọn.