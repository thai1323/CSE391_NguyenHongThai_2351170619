
// 1. pipe() — Nối chuỗi các function xử lý dữ liệu liên tiếp (Pipeline)
function pipe(...fns) {
    // Trả về một hàm mới nhận vào giá trị ban đầu (initialValue)
    return function(initialValue) {
        // Dùng reduce để luân chuyển kết quả của hàm trước làm đầu vào của hàm sau
        return fns.reduce((currentValue, currentFunction) => {
            return currentFunction(currentValue);
        }, initialValue);
    };
}

// 2. memoize() — Lưu trữ kết quả tính toán vào bộ nhớ đệm (Cache) theo tham số
function memoize(fn) {
    // Khởi tạo một Object ẩn đóng vai trò làm kho lưu trữ Cache (Nhờ cơ chế Closure)
    const cache = {};

    return function(...args) {
        // Biến mảng các tham số đầu vào thành một chuỗi Key duy nhất
        const key = JSON.stringify(args);

        // Nếu Key này đã từng được tính toán trước đó -> Trả về kết quả luôn
        if (key in cache) {
            return cache[key];
        }

        // Nếu chưa có, tiến hành thực thi hàm gốc và lưu kết quả vào Cache
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

// 3. debounce() — Trì hoãn thực thi, chỉ chạy sau khi user đã ngừng gõ/ngừng gọi một khoảng 'delay'

function debounce(fn, delay) {
    let timeoutId = null;

    return function(...args) {
        // Đóng gói ngữ cảnh thực thi (this) và các tham số truyền vào
        const context = this;

        // Nếu lệnh cũ đang xếp hàng chờ chưa kịp chạy -> Xóa bỏ lịch hẹn cũ ngay lập tức
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Lên lịch hẹn mới cho hàm
        timeoutId = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}

// 4. retry() — Tự động thực thi lại hàm bất đồng bộ (Async) nếu xảy ra lỗi cho đến khi thành công hoặc chạm giới hạn

async function retry(fn, maxAttempts = 3) {
    let lastError = null;

    // Vòng lặp chạy qua số lần thử tối đa được cho phép
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            // Thử thực thi hàm gốc bằng await
            return await fn();
        } catch (error) {
            lastError = error;
            console.log(`[Hệ thống]: Thử lần ${attempt} thất bại. Gặp lỗi: ${error.message}`);
            
            // Nếu đã chạm mốc giới hạn cuối cùng mà vẫn lỗi -> Thoát vòng lặp để ném lỗi ra ngoài
            if (attempt === maxAttempts) {
                break;
            }
        }
    }

    // Ném ra lỗi cuối cùng thu thập được nếu tất cả các lượt thử đều sụp đổ
    throw new Error(`[Hệ thống]: Đã thử lại tối đa ${maxAttempts} lần nhưng vẫn thất bại! Chi tiết: ${lastError.message}`);
}


console.log("=== TEST CASE 1: PIPE FUNCTION ===");
const processPipeline = pipe(
    x => x * 2,         // 5 → 10
    x => x + 10,        // 10 → 20
    x => x.toString(),  // 20 → "20"
    x => "Kết quả: " + x
);
console.log(processPipeline(5)); // → Kỳ vọng in ra: "Kết quả: 20"


console.log("\n=== TEST CASE 2: MEMOIZE (CACHE) ===");
const expensiveCalc = memoize((n) => {
    console.log("Đang tính toán tác vụ nặng...");
    let result = 0;
    for (let i = 0; i < n; i++) result += i;
    return result;
});

console.log("Lần chạy 1:");
console.log("Kết quả:", expensiveCalc(1000000)); // Hiện chữ "Đang tính..."

console.log("Lần chạy 2 (Lấy từ bộ nhớ Cache):");
console.log("Kết quả:", expensiveCalc(1000000)); // Lấy ngay kết quả lập tức, KHÔNG in chữ "Đang tính..."


console.log("\n=== TEST CASE 3: DEBOUNCE (Chạy bất đồng bộ) ===");
const search = debounce((query) => {
    console.log("-> Searching thực tế kích hoạt cho từ khóa:", query);
}, 500);

console.log("Gõ phím liên tục...");
search("a");
search("ap");
search("app");
search("apple"); // Chỉ duy nhất lệnh cuối cùng này được chạy sau 500ms dừng gõ


console.log("\n=== TEST CASE 4: RETRY FUNCTION ===");
// Hàm giả lập tạo kết nối API mạng hên xui (Lỗi 2 lần đầu, thành công ở lần thứ 3)
let networkAttempts = 0;
const unstableFetchData = async () => {
    networkAttempts++;
    if (networkAttempts < 3) {
        throw new Error("Lỗi mất kết nối mạng (Timeout 408)");
    }
    return "Dữ liệu API tải về thành công! 🎉";
};

// Kích hoạt hàm kiểm thử Retry bằng một hàm bọc IIFE async tự gọi
(async () => {
    try {
        const result = await retry(unstableFetchData, 4);
        console.log("-> Kết quả cuối cùng của hàm Retry:", result);
    } catch (err) {
        console.error(err.message);
    }
})();