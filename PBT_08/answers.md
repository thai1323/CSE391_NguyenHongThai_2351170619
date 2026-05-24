## PHẦN A — KIỂM TRA ĐỌC HIỂU 

### Câu A2 — Scope & Closure
## 1. Kết quả Output dự đoán

```javascript
// --- ĐOẠN 1 ---
const c = counter();
console.log(c.increment());  // OUTPUT: 1
console.log(c.increment());  // OUTPUT: 2
console.log(c.increment());  // OUTPUT: 3
console.log(c.decrement());  // OUTPUT: 2
console.log(c.getCount());   // OUTPUT: 2

// --- ĐOẠN 2 (Mốc thời gian in ra màn hình) ---
// Sau 100ms:
// var: 3
// var: 3
// var: 3

// Sau 200ms:
// let: 0
// let: 1
// let: 2

## 2. Giải thích chi tiết bản chất kỹ thuật
A. Cơ chế hoạt động của Đoạn 1 (Closure cơ bản)
Khi hàm counter() được thực thi, một môi trường tham chiếu (Lexical Environment) được tạo ra để lưu trữ biến cục bộ let count = 0;.

Hàm counter() trả về một đối tượng chứa 3 phương thức (increment, decrement, getCount). Nhờ cơ chế Closure, cả 3 hàm Arrow này đều "ghi nhớ" và có quyền truy cập chung vào cùng một biến count ẩn đó, ngay cả khi hàm counter() đã chạy xong và thoát khỏi Call Stack.

Phép toán ++count và --count thay đổi trực tiếp giá trị của biến chung này qua từng dòng lệnh, giúp trạng thái dữ liệu được bảo toàn liên tục qua các lần gọi.

B. Tại sao var và let cho kết quả khác nhau trong vòng lặp setTimeout?
Bản chất sự khác biệt nằm ở cơ chế quản lý phạm vi biến (Scope) kết hợp với vòng đời xử lý bất đồng bộ (Event Loop):

1. Trường hợp sử dụng var:
Phạm vi (Scope): Từ khóa var không có phạm vi khối (Block Scope) mà thuộc phạm vi hàm hoặc toàn cục (Global Scope). Do đó, trong suốt cả 3 lượt lặp của vòng for, JavaScript chỉ khởi tạo đúng một biến i duy nhất.

Bất đồng bộ: Hàm setTimeout là tác vụ bất đồng bộ. Nó sẽ đẩy các hàm console.log vào hàng đợi (Callback Queue) để chờ chạy sau 100ms. Trong thời gian ngắn ngủi đó, vòng lặp for đồng bộ đã chạy xong hoàn toàn và tăng biến i lên đến giá trị dừng là 3.

Kết quả: Khi hết 100ms, cả 3 hàm callback đồng loạt kích hoạt. Chúng cùng nhìn vào một ô nhớ của biến i duy nhất lúc này đã bằng 3. Vì vậy màn hình in ra: var: 3, var: 3, var: 3.

2. Trường hợp sử dụng let:
Phạm vi (Scope): Từ khóa let có tính chất Block Scope (Phạm vi khối). Cứ mỗi một vòng lặp {} diễn ra, JavaScript lại ép hệ thống cấp phát và tạo ra một biến j hoàn toàn mới, nằm ở một ô nhớ độc lập dành riêng cho lượt lặp đó.

Cơ chế Closure: Khi setTimeout được đăng ký, hàm callback của lượt lặp nào sẽ tự động "đóng gói" (Closure) để giữ chặt lấy giá trị của biến j thuộc lượt lặp đó (0, 1, hoặc 2).

Kết quả: Sau 200ms, khi các hàm callback được lôi ra thực thi, chúng tìm ngược về đúng ô nhớ riêng biệt đã được đóng gói từ trước của mình và in ra kết quả chuẩn xác theo trình tự thời gian: let: 0, let: 1, let: 2.

### Câu A3 — Array Methods

Khai báo mảng ban đầu:
```javascript
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// 1. Lấy các số chẵn (Dùng filter lọc các số chia hết cho 2)
const evens = nums.filter(x => x % 2 === 0); // → [2, 4, 6, 8, 10]

// 2. Nhân mỗi số với 3 (Dùng map để biến đổi từng phần tử)
const tripled = nums.map(x => x * 3); // → [3, 6, 9, ..., 30]

// 3. Tính tổng tất cả (Dùng reduce cộng dồn với giá trị khởi tạo bằng 0)
const totalSum = nums.reduce((sum, x) => sum + x, 0); // → 55

// 4. Tìm số đầu tiên > 7 (Dùng find để lấy phần tử thỏa mãn đầu tiên)
const firstGreaterThanSeven = nums.find(x => x > 7); // → 8

// 5. Kiểm tra CÓ số nào > 10 không (Dùng some để check điều kiện ít nhất một phần tử)
const hasGreaterThanTen = nums.some(x => x > 10); // → false

// 6. Kiểm tra TẤT CẢ đều > 0 (Dùng every để cam kết mọi phần tử đều thỏa mãn)
const allPositive = nums.every(x => x > 0); // → true

// 7. Tạo mảng "Số X là [chẵn/lẻ]" (Dùng map kết hợp Template Literal và toán tử ba ngôi)
const parityStrings = nums.map(x => `Số ${x} là ${x % 2 === 0 ? "chẵn" : "lẻ"}`); 
// → ["Số 1 là lẻ", "Số 2 là chẵn", ...]

// 8. Đảo ngược mảng mà không làm biến đổi mảng gốc (Dùng toán tử spread [...] để clone mảng trước khi .reverse())
const reversedNums = [...nums].reverse(); // → [10, 9, ..., 1]

### Câu A4 — Object Destructuring & Spread
## 1. Kết quả Output dự đoán
```javascript
const product = {
    name: "iPhone 16",
    price: 25990000,
    specs: { ram: 8, storage: 256, color: "Titan" }
};

// --- PHẦN DESTRUCTURING ---
const { name, price, specs: { ram, color } } = product;

console.log(name, price, ram, color);  
// OUTPUT: iPhone 16 25990000 8 Titan

console.log(specs);                    
// OUTPUT: ReferenceError: specs is not defined


// --- PHẦN SPREAD ---
const updated = { ...product, price: 23990000, sale: true };

console.log(updated.price);            
// OUTPUT: 23990000

console.log(updated.sale);             
// OUTPUT: true

console.log(product.price);            
// OUTPUT: 25990000 (Giá gốc KHÔNG đổi)


// --- PHẦN SPREAD GOTCHA ---
const copy = { ...product };
copy.specs.ram = 16;

console.log(product.specs.ram);        
// OUTPUT: 16 (Giá gốc BỊ THAY ĐỔI từ 8 thành 16)

## PHẦN C — SUY LUẬN
### Câu C1 — Refactor Code

const processOrders = orders => 
    orders
        // 1. Lọc đơn hàng đã hoàn thành và có giá trị > 100k
        .filter(({ status, total }) => status === "completed" && total > 100000)
        // 2. Biến đổi dữ liệu, destructuring để lấy thuộc tính và tính discount/finalTotal trực tiếp
        .map(({ id, customer, total }) => ({ id, customer, total, discount: total * 0.1, finalTotal: total * 0.9 }))
        // 3. Sắp xếp mảng kết quả theo finalTotal giảm dần
        .sort((a, b) => b.finalTotal - a.finalTotal);

const mockOrders = [
    { id: 101, customer: "An", total: 150000, status: "completed" },
    { id: 102, customer: "Bình", total: 50000, status: "completed" }, // Loại vì total <= 100k
    { id: 103, customer: "Chi", total: 300000, status: "pending" },   // Loại vì chưa completed
    { id: 104, customer: "Dũng", total: 500000, status: "completed" },
    { id: 105, customer: "Em", total: 200000, status: "completed" }
];

console.log("=== KẾT QUẢ ĐƠN HÀNG SAU KHI REFACTOR ===");
console.log(processOrders(mockOrders));

### Câu C2 — Thiết kế API

const miniArray = {
    /**
     * Hàm map: Biến đổi từng phần tử trong mảng theo một hàm callback cho trước
     * @param {Array} arr - Mảng dữ liệu gốc
     * @param {Function} fn - Hàm callback xử lý (element, index, originalArray)
     * @returns {Array} Mảng mới sau khi đã biến đổi
     */
    map(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            // Đẩy kết quả sau khi chạy hàm fn vào mảng mới
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },

    /**
     * Hàm filter: Sàng lọc các phần tử thỏa mãn điều kiện logic của hàm callback
     * @param {Array} arr - Mảng dữ liệu gốc
     * @param {Function} fn - Hàm callback kiểm tra (element, index, originalArray) -> Trả về boolean
     * @returns {Array} Mảng mới chứa các phần tử vượt qua bộ lọc
     */
    filter(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            // Nếu hàm fn trả về giá trị mang tính chất đúng (truthy)
            if (fn(arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    },

    /**
     * Hàm reduce: Tích lũy các phần tử trong mảng thành một giá trị duy nhất
     * @param {Array} arr - Mảng dữ liệu gốc
     * @param {Function} fn - Hàm callback tích lũy (accumulator, currentValue, index, originalArray)
     * @param {any} initialValue - Giá trị khởi tạo ban đầu (Tùy chọn)
     * @returns {any} Giá trị tích lũy cuối cùng
     */
    reduce(arr, fn, initialValue) {
        // Kiểm tra xem người dùng có truyền tham số thứ 3 (initialValue) hay không
        const hasInitialValue = initialValue !== undefined;
        
        // Nếu có truyền thì biến tích lũy bắt đầu từ initialValue, ngược lại lấy phần tử đầu tiên của mảng [0]
        let accumulator = hasInitialValue ? initialValue : arr[0];
        
        // Nếu không có initialValue, vòng lặp tính toán sẽ bắt đầu từ phần tử thứ hai [1]
        const startIndex = hasInitialValue ? 0 : 1;

        for (let i = startIndex; i < arr.length; i++) {
            accumulator = fn(accumulator, arr[i], i, arr);
        }

        return accumulator;
    }
};


console.log("=== KIỂM TRA MINIARRAY.MAP ===");
console.log(miniArray.map([1, 2, 3], x => x * 2));         // Kết quả: [2, 4, 6]

console.log("\n=== KIỂM TRA MINIARRAY.FILTER ===");
console.log(miniArray.filter([1, 2, 3, 4], x => x > 2));     // Kết quả: [3, 4]

console.log("\n=== KIỂM TRA MINIARRAY.REDUCE (CÓ INITIAL VALUE) ===");
console.log(miniArray.reduce([1, 2, 3, 4], (a, b) => a + b, 0)); // Kết quả: 10

console.log("\n=== TEST CHUYÊN SÂU: REDUCE KHÔNG TRUYỀN INITIAL VALUE ===");
