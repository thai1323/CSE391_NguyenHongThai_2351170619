## PHẦN A — KIỂM TRA ĐỌC HIỂU 

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
