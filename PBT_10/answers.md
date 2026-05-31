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

### Câu A3 — Promise States
1. Sơ đồ 3 trạng thái của một Promise
+-------------------+
                      |      PENDING      |  <--- Trạng thái khởi tạo ban đầu
                      | (Đang chờ xử lý)  |       (Mặc định: undefined)
                      +-------------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
        |  Tác vụ thành công                            |  Tác vụ thất bại
        |  Gọi hàm resolve(value)                       |  Gọi hàm reject(error)
        v                                               v
+-------------------+                           +-------------------+
|     FULFILLED     |                           |     REJECTED      |
|  (Đã hoàn thành)  |                           |   (Bị từ chối)    |
+-------------------+                           +-------------------+
        |                                               |
        v                                               v
  Kích hoạt hàm .then()                           Kích hoạt hàm .catch()

2. 
Callback Hell là: là hiện tượng các hàm xử lý bất đồng bộ lồng nhau quá nhiều cấp thông qua các hàm gọi lại (callbacks).
Khi một tác vụ bất đồng bộ sau cần kết quả của tác vụ bất đồng bộ trước làm tham số đầu vào, các lập trình viên thời kỳ cũ buộc phải viết code thụt lề sâu dần về phía bên phải.
Tác hại của Callback Hell:
    Khó đọc & khó bảo trì: Cấu trúc mã nguồn bị kéo dài theo chiều ngang giống hình mũi tên hoặc kim tự tháp, khiến việc theo dõi luồng chạy cực kỳ mệt mỏi.
    Bẫy quản lý lỗi (Error Handling): Rất khó bắt lỗi một cách tập trung. Bạn phải viết các dòng kiểm tra lỗi (if (err)) lặp đi lặp lại ở mọi cấp lồng nhau.
    Khó tái sử dụng: Việc bóc tách hoặc tái cấu trúc một đoạn mã nhỏ nằm sâu bên trong cấu trúc lồng nhau là một cực hình.
3. Minh họa ví dụ: 4 cấp Callback Hell
Hãy tưởng tượng một quy trình đặt đồ ăn online gồm 4 bước bất đồng bộ nối tiếp nhau:
Xác thực tài khoản -> 2. Kiểm tra số dư ví -> 3. Tạo đơn hàng _> 4. Gửi thông báo SMS.
Mã nguồn sử dụng Callback truyền thống (Bị Callback Hell):
// Giả lập hàm gọi API xác thực bằng Callback
function verifyUser(userId, callback) {
    setTimeout(() => {
        console.log("1. Xác thực người dùng thành công.");
        callback(null, { userId: userId, username: "hoang_vinh" });
    }, 500);
}

function checkWallet(username, callback) {
    setTimeout(() => {
        console.log("2. Ví đủ tiền thanh toán.");
        callback(null, { balance: 500000 });
    }, 500);
}

function createOrder(item, callback) {
    setTimeout(() => {
        console.log("3. Đã khởi tạo đơn hàng: " + item);
        callback(null, { orderId: "ORD999", status: "Success" });
    }, 500);
}

function sendSMS(orderId, callback) {
    setTimeout(() => {
        console.log("4. Đã gửi tin nhắn SMS xác nhận.");
        callback(null, "SMS_SENT_OK");
    }, 500);
}

// KÍCH HOẠT CHẠY - Gặp thảm họa Callback Hell lồng nhau 4 cấp (Pyramid of Doom)
verifyUser("USER_123", (err1, user) => {
    if (err1) {
        console.error("Lỗi xác thực:", err1);
    } else {
        checkWallet(user.username, (err2, wallet) => {
            if (err2) {
                console.error("Lỗi ví tiền:", err2);
            } else {
                createOrder("Bún Chả Chấm", (err3, order) => {
                    if (err3) {
                        console.error("Lỗi tạo đơn:", err3);
                    } else {
                        sendSMS(order.orderId, (err4, smsStatus) => {
                            if (err4) {
                                console.error("Lỗi gửi tin:", err4);
                            } else {
                                console.log("==> HOÀN THÀNH QUY TRÌNH ĐẶT HÀNG! Trạng thái:", smsStatus);
                            }
                        });
                    }
                });
            }
        });
    }
});
4. Giải pháp: Cải tiến cấu trúc (Refactor) thành Async / Await
Để giải quyết triệt để Callback Hell, chúng ta sẽ bọc các hàm ngầm định bên trên bằng cấu trúc Promise, sau đó sử dụng bộ đôi từ khóa async/await (được giới thiệu từ ES7). Cách làm này biến mã nguồn bất đồng bộ nhìn gọn gàng, tuần tự giống hệt như mã đồng bộ thông thường.
Mã nguồn sau khi tối ưu (Refactor):
// Chuyển đổi các hàm gốc sang trả về Promise thay vì nhận callback
const verifyUserPromise = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("1. [Promise] Xác thực người dùng thành công.");
            resolve({ userId: userId, username: "hoang_vinh" });
        }, 500);
    });
};

const checkWalletPromise = (username) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("2. [Promise] Ví đủ tiền thanh toán.");
            resolve({ balance: 500000 });
        }, 500);
    });
};

const createOrderPromise = (item) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("3. [Promise] Đã khởi tạo đơn hàng: " + item);
            resolve({ orderId: "ORD999", status: "Success" });
        }, 500);
    });
};

const sendSMSPromise = (orderId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("4. [Promise] Đã gửi tin nhắn SMS xác nhận.");
            resolve("SMS_SENT_OK");
        }, 500);
    });
};

// HÀM ĐIỀU PHỐI CHÍNH: Phẳng hóa code hoàn toàn bằng Async/Await kết hợp Try...Catch
async function executeOrderWorkflow() {
    try {
        // Code chạy thẳng một mạch dọc xuống, không còn thụt lề ô vuông
        const user = await verifyUserPromise("USER_123");
        
        const wallet = await checkWalletPromise(user.username);
        
        const order = await createOrderPromise("Bún Chả Chấm");
        
        const smsStatus = await sendSMSPromise(order.orderId);
        
        console.log("==> HOÀN THÀNH QUY TRÌNH ĐẶT HÀNG! Trạng thái:", smsStatus);
        
    } catch (error) {
        // Quản lý lỗi tập trung duy nhất tại một nơi cho cả 4 bước bất đồng bộ
        console.error("Quy trình đặt hàng thất bại tại một trong các bước:", error);
    }
}

// Kích hoạt chạy thử nghiệm quy trình mới phẳng hóa
executeOrderWorkflow();
## PHẦN C — PHÂN TÍCH 
### Câu C1 — Error Handling Strategy
1. Xử lý lỗi Network Errors (Mất kết nối mạng giữa chừng)
Chiến lược xử lý:
Phát hiện chủ động: Khi người dùng đang thao tác (ví dụ: bấm nút "Thanh toán") mà thiết bị mất kết nối internet, fetch sẽ lập tức ném ra lỗi thuộc kiểu TypeError: Failed to fetch.

Trải nghiệm người dùng (UX): Không để ứng dụng bị đóng băng hoặc chỉ hiển thị vòng xoay loading vô tận. Lập tức hiển thị một thanh thông báo (Toast notification) hoặc màn hình chặn (Overlay) thông báo: "Mất kết nối Internet. Vui lòng kiểm tra lại mạng mạng của bạn.".

Lắng nghe sự kiện hệ thống: Sử dụng sự kiện window.addEventListener('online'/'offline') để tự động phục hồi hoặc vô hiệu hóa các nút chức năng quan trọng.
2. Xử lý lỗi API Errors (Server trả về mã lỗi 404, 429, 500)
Mỗi nhóm mã trạng thái HTTP (HTTP Status Codes) đại diện cho một ngữ cảnh lỗi khác nhau, do đó cần có kịch bản ứng phó riêng biệt:

Mã 404 (Not Found - Không tìm thấy tài nguyên):
Ngữ cảnh: Người dùng truy cập vào một link sản phẩm đã bị xóa hoặc sai ID.

Xử lý: Điều hướng người dùng về trang lỗi 404 - Product Not Found được thiết kế đẹp mắt kèm theo danh sách "Sản phẩm gợi ý khác" để giữ chân khách hàng, thay vì để màn hình trống.

Mã 429 (Too Many Requests - Quá nhiều yêu cầu / Bị chặn Spam):
Ngữ cảnh: Người dùng (hoặc bot) liên tục click spam nút "Áp mã giảm giá".

Xử lý: Đọc Header Retry-After từ Server trả về (nếu có) để biết cần chờ bao nhiêu giây. Khóa (Disabled) nút chức năng đó lại, hiển thị đồng hồ đếm ngược và thông báo: "Bạn đang thao tác quá nhanh. Vui lòng thử lại sau X giây.".
Mã 500 (Internal Server Error - Lỗi hệ thống máy chủ):
Ngữ cảnh: Database của Server bị quá tải hoặc code backend gặp lỗi crash.

Xử lý: Hiển thị thông báo chung mang tính xoa dịu: "Hệ thống đang bận hoặc đang bảo trì. Vui lòng quay lại sau ít phút". Đồng thời, hệ thống frontend cần tự động ghi nhận (Log) lỗi này lên các công cụ giám sát tập trung (như Sentry).
3. Timeout Handling (API phản hồi quá chậm > 10 giây)
Mặc định, fetch của trình duyệt không có thời gian timeout định sẵn (nó có thể chờ lên đến vài phút tùy cấu hình trình duyệt). Trong E-commerce, việc bắt người dùng chờ quá 10 giây cho một tác vụ tải danh sách sản phẩm là không thể chấp nhận được.

Chúng ta sẽ giải quyết bằng cách kết hợp fetch với AbortController để chủ động hủy request khi vượt quá thời gian cho phép.
Mã nguồn fetchWithTimeout(url, options, ms):
async function fetchWithTimeout(url, options = {}, ms = 10000) {
    // 1. Khởi tạo bộ điều khiển hủy bỏ tác vụ
    const controller = new AbortController();
    const { signal } = controller;

    // 2. Thiết lập đồng hồ đếm ngược
    const timeoutId = setTimeout(() => {
        controller.abort(); // Kích hoạt hủy bỏ request nếu hết giờ
    }, ms);

    try {
        // 3. Gắn signal vào cấu hình fetch
        const response = await fetch(url, { ...options, signal });
        clearTimeout(timeoutId); // Xóa bộ đếm ngược nếu fetch thành công trước thời hạn
        return response;
    } catch (error) {
        clearTimeout(timeoutId); // Đảm bảo xóa bộ đếm nếu có lỗi khác xảy ra
        
        // Kiểm tra xem lỗi này có phải do chúng ta chủ động abort hay không
        if (error.name === 'AbortError') {
            throw new Error(`Request Timeout: API không phản hồi sau ${ms / 1000} giây.`);
        }
        throw error; // Ném tiếp các lỗi network khác nếu có
    }
}

// ---- HƯỚNG DẪN SỬ DỤNG THỰC TẾ ----
// fetchWithTimeout("https://api.example.com/products", {}, 10000)
//     .then(res => console.log("Thành công"))
//     .catch(err => console.error("Thất bại:", err.message));

Giải thích code:
AbortController cung cấp một đối tượng signal. Khi ta truyền signal này vào fetch, fetch sẽ liên tục lắng nghe tín hiệu từ bộ điều khiển.

Nếu hàm setTimeout chạy trước (đạt mốc ms chỉ định), lệnh controller.abort() được kích hoạt, khiến fetch lập tức dừng việc chờ đợi và ném ra một lỗi có thuộc tính name bằng 'AbortError'.

4. Retry Logic (Cơ chế tự động thử lại)
Đối với các lỗi mang tính tạm thời (như lỗi kết nối mạng chập chờn, rớt gói tin hoặc Server bị quá tải tích tắc), giải pháp tốt nhất là tự động gửi lại yêu cầu (Retry) vài lần trước khi chính thức báo lỗi cho người dùng.
Mã nguồn fetchWithRetry(url, options, maxRetries, delay):
async function fetchWithRetry(url, options = {}, maxRetries = 3, delay = 2000) {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Đang thử tải lần ${attempt}/${maxRetries}...`);
            
            // Sử dụng luôn hàm fetch có chống nghẽn Timeout ở Mục 3 phía trên
            const response = await fetchWithTimeout(url, options, 10000);

            // Nếu kết nối được nhưng Server báo lỗi 500 hoặc 429, chúng ta cũng cho phép retry
            if (!response.ok) {
                if (response.status === 500 || response.status === 429) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
            }

            return response; // Trả về kết quả ngay lập tức nếu thành công mượt mà
            
        } catch (error) {
            lastError = error;
            console.warn(`Lần thử ${attempt} thất bại. Lý do: ${error.message}`);

            // Nếu đã chạm tới giới hạn số lần thử lại cuối cùng, thoát vòng lặp để ném lỗi
            if (attempt === maxRetries) break;

            // Kỹ thuật trì hoãn (Delay) trước khi sang lần thử kế tiếp
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // Nếu chạy hết số lần lặp mà vẫn không thành công, ném ra lỗi cuối cùng thu thập được
    throw new Error(`Tải dữ liệu thất bại sau ${maxRetries} lần thử lại. Lỗi cuối: ${lastError.message}`);
}

// ---- HƯỚNG DẪN SỬ DỤNG THỰC TẾ ----
// async function loadCartData() {
//     try {
//         const response = await fetchWithRetry("https://api.example.com/cart", {}, 3, 2000);
//         const data = await response.json();
//         console.log("Dữ liệu giỏ hàng:", data);
//     } catch (err) {
//         // Hiển thị UI Toast thông báo lỗi tổng cuối cùng cho người dùng
//         alert(err.message);
//     }
// }
// loadCartData();

Giải thích code:
Vòng lặp for có kiểm soát: Hàm sử dụng một vòng lặp chạy từ 1 đến maxRetries. Nếu dòng lệnh await fetchWithTimeout chạy thành công, lệnh return response được kích hoạt phá vỡ vòng lặp và kết thúc hàm sớm.

Cơ chế bẫy lỗi cô lập: Khối try...catch nằm bên trong vòng lặp giúp cô lập các lỗi xảy ra ở lần thử đó. Thay vì làm sập toàn bộ hàm, nó ghi nhận lỗi vào biến lastError và cho phép vòng lặp tiếp tục xoay sang lượt tiếp theo.

Hàm đợi bất đồng bộ (Delay Promise): Dòng lệnh await new Promise(resolve => setTimeout(resolve, delay)) tạo ra một khoảng nghỉ (ví dụ 2 giây) giữa các lần thử. Điều này rất quan trọng vì nếu mạng đang rớt hoặc Server đang nghẽn, việc gửi 3 request liên tục trong 1 mili giây sẽ vô tác dụng và càng làm nặng thêm cho hệ thống. Khoảng nghỉ giúp hệ thống mạng/máy chủ có thời gian hồi phục.

### Câu C2 — Promise.all vs Promise.allSettled vs Promise.race
1. Bảng so sánh tổng quan (Kiến thức cốt lõi)
| Method | Khi nào resolve? | Khi nào reject? | Use case thực tế |
| :--- | :--- | :--- | :--- |
| **`Promise.all()`** | Khi **tất cả** các Promise trong mảng truyền vào đều thành công (`fulfilled`). Trả về mảng kết quả theo đúng thứ tự. | Ngay khi **có ít nhất một** Promise bị lỗi (`rejected`). Lập tức hủy bỏ việc đợi các Promise còn lại. | Tải các dữ liệu phụ thuộc lẫn nhau để dựng giao diện (Ví dụ: Trang Dashboard cần thông tin User + cấu hình chung). |
| **`Promise.allSettled()`** | Khi **tất cả** các Promise đều **đã chạy xong** (bất kể thành công hay thất bại). Không bao giờ rơi vào trạng thái reject. | **Không bao giờ** bị reject. | Tải các dữ liệu độc lập, không ảnh hưởng đến nhau (Ví dụ: Đổ danh sách sản phẩm, nếu box quảng cáo bên cạnh lỗi thì vẫn hiện sản phẩm). |
| **`Promise.race()`** | Khi **có một** Promise đầu tiên trong mảng chạy xong (bất kể nó **thành công hay thất bại**). | Khi Promise đầu tiên về đích bị **thất bại**. | Triển khai cơ chế Chống nghẽn mạng mạng (Request Timeout) hoặc chọn Server phản hồi nhanh nhất. |
| **`Promise.any()`** | Khi **có một** Promise đầu tiên về đích **thành công** (`fulfilled`). | Chỉ khi **tất cả** các Promise trong mảng đều **thất bại**. Trả về một lỗi gộp `AggregateError`. | Gọi dữ liệu từ nhiều nguồn dự phòng (Cùng một file đặt ở 3 máy chủ CDN khác nhau, nguồn nào tải thành công trước thì lấy). |
2. Kịch bản và Ví dụ Mã nguồn Thực tế (Real-world Scenarios)
Scenario 1: Sử dụng Promise.all() cho trang chi tiết Đơn hàng (Order Details)
// Giả lập các hàm gọi API thực tế trả về dữ liệu
const fetchOrderItems = () => fetch("https://api.store.com/orders/99/items").then(res => res.json());
const fetchUserProfile = () => fetch("https://api.store.com/users/123/profile").then(res => res.json());
const fetchShippingStatus = () => fetch("https://api.store.com/shipping/track/99").then(res => res.json());

async function loadOrderDashboard() {
    try {
        console.log("=== Đang tải toàn bộ dữ liệu đơn hàng... ===");
        
        // Kích hoạt chạy đồng thời cả 3 API cùng lúc để tối ưu thời gian (Parallel)
        const [items, profile, shipping] = await Promise.all([
            fetchOrderItems(),
            fetchUserProfile(),
            fetchShippingStatus()
        ]);

        console.log("✅ Tải thành công! Tiến hành render giao diện.");
        console.log("Sản phẩm:", items);
        console.log("Khách hàng:", profile);
        console.log("Vận chuyển:", shipping);

    } catch (error) {
        // Nếu API Shipping bị lỗi 500, khối Promise.all sụp đổ lập tức và nhảy vào đây
        console.error("❌ Thất bại: Không thể dựng trang do thiếu dữ liệu cốt lõi!", error.message);
        showErrorPage("Hệ thống gặp sự cố khi tải thông tin đơn hàng.");
    }
}
loadOrderDashboard();
Scenario 2: Sử dụng Promise.allSettled() cho trang quản trị Dashboard tổng quan
const fetchRevenue = () => fetch("https://api.store.com/analytics/revenue").then(res => res.json());
const fetchComments = () => fetch("https://api.store.com/moderation/latest-comments").then(res => res.json());
const fetchSystemLogs = () => fetch("https://api.sập-nguồn.com/logs").then(res => res.json()); // Giả lập nguồn lỗi

async function loadIndependentWidgets() {
    console.log("=== Đang nạp các Widget độc lập... ===");

    const results = await Promise.allSettled([
        fetchRevenue(),
        fetchComments(),
        fetchSystemLogs()
    ]);

    // Mảng results trả về cấu trúc gồm: { status: "fulfilled", value: ... } hoặc { status: "rejected", reason: ... }
    results.forEach((result, index) => {
        const widgetNames = ["Doanh Thu", "Bình Luận", "Nhật Ký Hệ Thống"];
        
        if (result.status === "fulfilled") {
            console.log(`✅ Widget [${widgetNames[index]}] tải tốt:`, result.value);
            renderWidgetSuccess(widgetNames[index], result.value);
        } else {
            console.warn(`⚠️ Widget [${widgetNames[index]}] bị lỗi ngầm:`, result.reason.message);
            renderWidgetErrorPlaceholder(widgetNames[index]); // Vẫn vẽ giao diện nhưng hiển thị dấu ⚠️ báo lỗi cục bộ
        }
    });
}
loadIndependentWidgets();
Scenario 3: Sử dụng Promise.race() để làm Cơ chế Timeout cho API nhạy cảm
// API cổng thanh toán thật (Ví dụ đang bị nghẽn mạng mất 8 giây)
const processBankPayment = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ transactionId: "TX_RE293", status: "PAID" }), 8000);
    });
};

// Hàm tạo một Promise chủ động ném lỗi sau thời gian định sẵn
const createTimeoutTrigger = (seconds) => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Quá thời gian phản hồi từ ngân hàng!")), seconds * 1000);
    });
};

async function executePaymentRequest() {
    try {
        console.log("=== Đang gửi yêu cầu thanh toán sang phía Ngân hàng... ===");

        // Cuộc đua xem bên nào chạy xong trước
        const winningResult = await Promise.race([
            processBankPayment(),
            createTimeoutTrigger(5) // Giới hạn chặn tối đa 5 giây
        ]);

        console.log("🎉 Thanh toán thành công rực rỡ!", winningResult);

    } catch (error) {
        // Vì hàm Timeout hoàn thành ở giây thứ 5, nhanh hơn API thật (8 giây), nên nó thắng cuộc đua và ném lỗi vào đây
        console.error("🚨 Giao dịch thất bại:", error.message);
        showToastNotification("Cổng thanh toán phản hồi chậm. Vui lòng kiểm tra lại số dư hoặc thử lại.");
    }
}
executePaymentRequest();
Scenario 4: Sử dụng Promise.any() để tải Tệp tin từ cụm Máy chủ dự phòng (CDN Cluster)
// Các nguồn tải ảnh từ các CDN khác nhau
const downloadFromSingaporeCDN = () => fetch("https://sg.cdn.com/banner.png").then(res => res.blob());
const downloadFromVietnamCDN = () => fetch("https://vn.cdn.com/banner.png").then(res => res.blob());
const downloadFromJapanCDN = () => fetch("https://jp.cdn.com/banner.png").then(res => res.blob());

async function loadHeroBanner() {
    try {
        console.log("=== Đang tối ưu tìm kiếm máy chủ CDN tải ảnh nhanh nhất... ===");

        // Chỉ cần 1 nguồn thành công đầu tiên. Nếu có 1 nguồn chết nhưng nguồn khác sống thì vẫn chạy tốt.
        const fastestImageBlob = await Promise.any([
            downloadFromSingaporeCDN(),
            downloadFromVietnamCDN(),
            downloadFromJapanCDN()
        ]);

        console.log("✅ Đã lấy được hình ảnh từ CDN tối ưu nhất!");
        const imgUrl = URL.createObjectURL(fastestImageBlob);
        document.getElementById("hero-banner").src = imgUrl;

    } catch (aggregateError) {
        // Chỉ lọt vào đây khi CẢ 3 máy chủ CDN đồng loạt sập hoàn toàn
        console.error("🚨 Tất cả các máy chủ CDN đều không thể kết nối!");
        console.log("Danh sách các lỗi chi tiết thu gom được:", aggregateError.errors);
        
        // Tải ảnh cục bộ (fallback local) dự phòng trong source code
        document.getElementById("hero-banner").src = "images/default-banner.png";
    }
}
loadHeroBanner();