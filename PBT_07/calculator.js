/**
 * Hàm thực hiện tính toán số học cơ bản giữa 2 số.
 * @param {any} num1 - Số thứ nhất
 * @param {string} operator - Toán tử thực hiện ("+", "-", "*", "/", "%", "**")
 * @param {any} num2 - Số thứ hai
 * @returns {number|string} Kết quả phép tính hoặc thông báo lỗi cụ thể
 */
function calculate(num1, operator, num2) {
    // 1. Kiểm tra đầu vào có phải là số hợp lệ hay không
    if (typeof num1 !== "number" || typeof num2 !== "number" || Number.isNaN(num1) || Number.isNaN(num2)) {
        return "Lỗi: Input không phải số";
    }

    // 2. Kiểm tra toán tử hợp lệ
    const validOperators = ["+", "-", "*", "/", "%", "**"];
    if (!validOperators.includes(operator)) {
        return `Lỗi: Operator '${operator}' không hợp lệ`;
    }

    // 3. Xử lý trường hợp chia cho 0 (Áp dụng cho cả phép chia lấy dư %)
    if ((operator === "/" || operator === "%") && num2 === 0) {
        return "Lỗi: Không thể chia cho 0";
    }

    // 4. Thực hiện các phép toán tương ứng
    switch (operator) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num1 / num2;
        case "%":
            return num1 % num2;
        case "**":
            return num1 ** num2; // Toán tử lũy thừa (ES6)
        default:
            return "Lỗi: Hệ thống không xác định";
    }
}

// ==========================================
// KHU VỰC CHẠY THỬ NGHIỆM (TEST CASES)
// ==========================================
console.log(calculate(10, "+", 5));    // → 15
console.log(calculate(10, "/", 0));    // → "Lỗi: Không thể chia cho 0"
console.log(calculate(10, "^", 5));    // → "Lỗi: Operator '^' không hợp lệ"
console.log(calculate("abc", "+", 5)); // → "Lỗi: Input không phải số"
console.log(calculate(2, "**", 10));   // → 1024