// ==========================================================================
// CÂU C2: CHƯƠNG TRÌNH IN HÓA ĐƠN NHÀ HÀNG TỰ ĐỘNG CĂN LỀ (JS THUẦN)
// ==========================================================================

/**
 * Hàm tính toán và in hóa đơn chi tiết ra console
 * @param {Array} items - Danh sách món ăn [{ name, price, quantity }]
 * @param {string} dayOfWeek - Ngày trong tuần (bằng tiếng Anh, ví dụ: "Wednesday")
 * @param {boolean} includeTip - Có tính tiền Tip 5% hay không (Mặc định: true)
 */
function printInvoice(items, dayOfWeek, includeTip = true) {
    // 1. Tính tổng tiền gốc của toàn bộ các món ăn
    let rawTotal = 0;
    const itemLines = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemCost = item.price * item.quantity;
        rawTotal += itemCost;

        // Lưu thông tin thô để căn lề và định dạng chuỗi in sau
        itemLines.push({
            stt: `${i + 1}.`,
            name: item.name,
            qty: `x${item.quantity}`,
            unitPrice: `@${(item.price / 1000)}k`,
            totalPrice: `${(itemCost / 1000)}k`
        });
    }

    // 2. Xác định phần trăm giảm giá theo bậc doanh thu
    let discountPercent = 0;
    if (rawTotal > 1000000) {
        discountPercent = 15; // Giảm 15% nếu tổng > 1 triệu
    } else if (rawTotal > 500000) {
        discountPercent = 10; // Giảm 10% nếu tổng > 500k
    }

    // Quy tắc bổ sung: Nếu đi vào ngày Thứ 3 (Wednesday) -> Cộng thêm 5% giảm giá
    if (dayOfWeek === "Wednesday") {
        discountPercent += 5;
    }

    // 3. Tính toán các chi phí phát sinh bổ sung
    const discountAmount = (rawTotal * discountPercent) / 100;
    const totalAfterDiscount = rawTotal - discountAmount;
    
    const vatAmount = (totalAfterDiscount * 8) / 100; // VAT 8% tính trên tổng sau giảm giá
    const tipAmount = includeTip ? (totalAfterDiscount * 5) / 100 : 0; // Tip 5% (nếu có)
    
    const finalPayment = totalAfterDiscount + vatAmount + tipAmount;

    // 4. THUẬT TOÁN DỰNG KHUNG VÀ CĂN LỀ CHUỖI (Độ rộng cố định: 44 ký tự)
    const WIDTH = 44;
    const formatMoney = (amount) => amount.toLocaleString('vi-VN') + "đ";

    // Hàm tạo dòng tiêu đề căn giữa
    const makeCenterLine = (text) => {
        const spaces = WIDTH - 4 - text.length;
        const leftSpaces = Math.floor(spaces / 2);
        const rightSpaces = spaces - leftSpaces;
        return `║${" ".repeat(leftSpaces)}${text}${" ".repeat(rightSpaces)}║`;
    };

    // Hàm tạo dòng thông số toán học căn hai vế
    const makeRowLine = (label, value) => {
        const spaceCount = WIDTH - 4 - label.length - value.length;
        return `║ ${label}${" ".repeat(spaceCount)}${value} ║`;
    };

    // --- BẮT ĐẦU IN HÓA ĐƠN ---
    console.log(`╔${"═".repeat(WIDTH - 2)}╗`);
    console.log(makeCenterLine("HÓA ĐƠN NHÀ HÀNG"));
    console.log(`╠${"═".repeat(WIDTH - 2)}╣`);

    // In danh sách món ăn (Căn lề tự động bằng padEnd)
    for (let i = 0; i < itemLines.length; i++) {
        const line = itemLines[i];
        // Tính toán độ rộng phân bổ cho từng cột dữ liệu nhỏ bên trong
        const partLeft = `${line.stt} ${line.name}`.padEnd(20, " ");
        const partQty = line.qty.padEnd(5, " ");
        const partPrice = line.unitPrice.padEnd(8, " ");
        const partTotal = line.totalPrice.padStart(7, " ");
        
        console.log(`║ ${partLeft}${partQty}${partPrice}= ${partTotal} ║`);
    }

    console.log(`╠${"═".repeat(WIDTH - 2)}╣`);
    
    // In các thông số tổng hợp tài chính
    console.log(makeRowLine("Tổng cộng:", formatMoney(rawTotal)));
    console.log(makeRowLine(`Giảm giá (${discountPercent}%):`, formatMoney(discountAmount)));
    console.log(makeRowLine("VAT (8%):", formatMoney(vatAmount)));
    console.log(makeRowLine(`Tip (${includeTip ? "5%" : "0%"}):`, formatMoney(tipAmount)));
    
    console.log(`╠${"═".repeat(WIDTH - 2)}╣`);
    console.log(makeRowLine("THANH TOÁN:", formatMoney(finalPayment)));
    console.log(`╚${"═".repeat(WIDTH - 2)}╝`);
}

// ==========================================================================
// KHU VỰC THỬ NGHIỆM ĐẦU VÀO (TEST CASES)
// ==========================================================================

// Bộ dữ liệu test 1: Đúng theo dữ liệu mô phỏng của đề bài (Tổng < 500k)
const order1 = [
    { name: "Phở bò", price: 65000, quantity: 2 },
    { name: "Trà đá", price: 5000, quantity: 3 },
    { name: "Bún chả", price: 55000, quantity: 1 }
];
console.log("KỊCH BẢN THỬ NGHIỆM 1: Hóa đơn thông thường ngày Thứ Hai");
printInvoice(order1, "Monday", true);


// Bộ dữ liệu test 2: Hóa đơn VIP siêu lớn > 1 triệu đồng vào ngày Thứ Ba (Wednesday) để ăn hai tầng khuyến mãi
const order2 = [
    { name: "Lẩu cua đồng", price: 450000, quantity: 2 },
    { name: "Gà không lối thoát", price: 320000, quantity: 1 },
    { name: "Bò sốt tiêu đen", price: 180000, quantity: 1 },
    { name: "Nước ngọt", price: 15000, quantity: 6 }
];
console.log("\nKỊCH BẢN THỬ NGHIỆM 2: Hóa đơn lớn > 1 triệu đi vào ngày thứ Tư (Wednesday) & Không Tip");
printInvoice(order2, "Wednesday", false);