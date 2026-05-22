// ==========================================================================
// CÂU B4: FIZZBUZZ NÂNG CAO (CLASSIC & CUSTOM VERSION)
// ==========================================================================

// --------------------------------------------------------------------------
// VERSION 1: CLASSIC FIZZBUZZ (1 - 100)
// --------------------------------------------------------------------------
function classicFizzBuzz() {
    console.log("--- CHẠY VERSION 1: CLASSIC FIZZBUZZ (1 - 100) ---");
    
    for (let i = 1; i <= 100; i++) {
        // Kiểm tra điều kiện đồng thời trước (chia hết cho 15)
        if (i % 3 === 0 && i % 5 === 0) {
            console.log("FizzBuzz");
        } else if (i % 3 === 0) {
            console.log("Fizz");
        } else if (i % 5 === 0) {
            console.log("Buzz");
        } else {
            console.log(i);
        }
    }
}


// --------------------------------------------------------------------------
// VERSION 2: CUSTOM FIZZBUZZ (MỞ RỘNG KHÔNG GIỚI HẠN RULES)
// --------------------------------------------------------------------------
/**
 * Hàm customFizzBuzz in ra các giá trị từ 1 đến n dựa trên bộ quy tắc động.
 * @param {number} n - Số giới hạn kết thúc vòng lặp
 * @param {Array} rules - Mảng chứa các đối tượng quy tắc { divisor, word }
 */
function customFizzBuzz(n, rules) {
    // Vòng lặp chạy từ 1 đến số n được chỉ định
    for (let i = 1; i <= n; i++) {
        let outputString = "";

        // Duyệt qua từng quy tắc (rule) được truyền vào bằng vòng lặp thuần
        for (let j = 0; j < rules.length; j++) {
            const currentRule = rules[j];
            
            // Nếu số i hiện tại chia hết cho ước số (divisor) của quy tắc đó
            if (i % currentRule.divisor === 0) {
                outputString += currentRule.word; // Cộng dồn từ tương ứng vào chuỗi kết quả
            }
        }

        // Nếu sau khi duyệt hết các quy tắc mà chuỗi vẫn rỗng -> Không chia hết cho số nào
        if (outputString === "") {
            console.log(i); // In ra chính số đó
        } else {
            console.log(`${i} = "${outputString}"`); // In ra số kèm chuỗi chữ tích lũy
        }
    }
}


// ==========================================
// KHU VỰC KÍCH HOẠT CHẠY THỬ (TEST CASES)
// ==========================================

// 1. Chạy thử bản cổ điển (Bỏ dấu ghi chú bên dưới nếu bạn muốn in từ 1-100)
// classicFizzBuzz();

console.log("\n--- CHẠY VERSION 2: CUSTOM FIZZBUZZ NÂNG CAO ---");

// Test Case từ đề bài: Kiểm tra tính năng ghép từ thông minh (Fizz, Buzz, Jazz)
const myRules = [
    { divisor: 3, word: "Fizz" },
    { divisor: 5, word: "Buzz" },
    { divisor: 7, word: "Jazz" }
];

// Chạy thử với n = 110 để kiểm tra toàn bộ các điểm biên nhạy cảm:
// 15 (FizzBuzz), 21 (FizzJazz), 35 (BuzzJazz), 105 (FizzBuzzJazz)
customFizzBuzz(110, myRules);