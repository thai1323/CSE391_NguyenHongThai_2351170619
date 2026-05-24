
function createCart() {
    let items = [];
    let currentDiscountCode = "";

    return {
        // 1. Thêm sản phẩm (nếu đã có trong giỏ -> tăng quantity)
        addItem(product, quantity = 1) {
            if (quantity <= 0) return;
            
            // Tìm xem sản phẩm đã tồn tại trong giỏ hàng chưa
            const existingItem = items.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                // Sử dụng cú pháp Spread để clone object product, tránh ảnh hưởng object gốc bên ngoài
                items.push({ ...product, quantity: quantity });
            }
        },
        
        // 2. Xóa sản phẩm ra khỏi giỏ theo id
        removeItem(productId) {
            items = items.filter(item => item.id !== productId);
        },
        
        // 3. Cập nhật số lượng mới cho một sản phẩm cụ thể
        updateQuantity(productId, newQuantity) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
                return;
            }
            const targetItem = items.find(item => item.id === productId);
            if (targetItem) {
                targetItem.quantity = newQuantity;
            }
        },
        
        // 4. Tính toán tổng tiền (Đã bao gồm xử lý trừ mã giảm giá)
        getTotal() {
            // Tính tổng tiền gốc trước khi giảm giá
            const rawTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Nếu giỏ hàng trống, trả về 0 luôn, tránh giảm giá âm tiền ship
            if (rawTotal === 0) return 0;

            // Xử lý logic tính toán theo từng loại mã giảm giá
            let finalTotal = rawTotal;
            if (currentDiscountCode === "SALE10") {
                finalTotal = rawTotal * 0.9;   // Giảm 10%
            } else if (currentDiscountCode === "SALE20") {
                finalTotal = rawTotal * 0.8;   // Giảm 20%
            } else if (currentDiscountCode === "FREESHIP") {
                finalTotal = rawTotal - 30000; // Trừ thẳng 30.000đ
            }

            // Phòng trường hợp tiền giảm giá nhiều hơn tiền hàng (nếu có mã lớn hơn)
            return finalTotal < 0 ? 0 : finalTotal;
        },
        
        // 5. Áp dụng mã giảm giá vào hệ thống bộ nhớ ẩn
        applyDiscount(code) {
            const validCodes = ["SALE10", "SALE20", "FREESHIP"];
            if (validCodes.includes(code)) {
                currentDiscountCode = code;
                console.log(`[Hệ thống]: Áp dụng thành công mã giảm giá "${code}".`);
            } else {
                console.log(`[Hệ thống]: Mã giảm giá "${code}" không tồn tại hoặc đã hết hạn.`);
            }
        },
        
        // 6. Tính tổng số lượng tất cả sản phẩm đang có (Cộng dồn quantity)
        getItemCount() {
            return items.reduce((total, item) => total + item.quantity, 0);
        },
        
        // 7. Xóa sạch sành sanh toàn bộ giỏ hàng và reset mã giảm giá
        clearCart() {
            items = [];
            currentDiscountCode = "";
        },

        // 8. KỸ THUẬT IN GIỎ HÀNG DẠNG BẢNG - TỰ ĐỘNG CĂN LỀ CHUẨN ĐỀ BÀI
        printCart() {
            const formatNumber = (num) => num.toLocaleString("vi-VN");
            
            console.log("┌──────────────────────────────────────────────┐");
            console.log("│ # │ Sản phẩm      │ SL │ Đơn giá   │ Tổng     │");
            
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const totalItemPrice = item.price * item.quantity;
                
                // Định dạng căn khoảng trắng cố định cho từng cột
                const stt = String(i + 1).padEnd(1, " ");
                const name = item.name.padEnd(13, " ");
                const qty = String(item.quantity).padStart(2, " ");
                const price = formatNumber(item.price).padStart(10, " ");
                const total = formatNumber(totalItemPrice).padStart(10, " ");
                
                console.log(`│ ${stt} │ ${name} │ ${qty} │ ${price} │ ${total} │`);
            }
            
            console.log("├──────────────────────────────────────────────┤");
            
            // In dòng tổng tiền cuối cùng sau khi đã chiết khấu
            const finalString = `${formatNumber(this.getTotal())}đ`;
            const spaceCount = 44 - "Tổng cộng:".length - finalString.length;
            
            // Thêm thông tin ghi chú nếu đang có mã giảm giá được kích hoạt
            if (currentDiscountCode) {
                console.log(`│ Mã giảm giá đang dùng: ${currentDiscountCode.padEnd(21, " ")} │`);
            }
            console.log(`│ Tổng cộng:${" ".repeat(spaceCount)}${finalString} │`);
            console.log("└──────────────────────────────────────────────┘");
        }
    };
}


console.log("=== KHỞI TẠO GIỎ HÀNG VÀ THÊM SẢN PHẨM ===");
const cart = createCart();

cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1); // Trùng id 1 -> Tăng SL lên 2

// Khởi in bảng lần thứ nhất
cart.printCart();

console.log("\n=== THỬ NGHIỆM ÁP MÃ GIẢM GIÁ SALE10 ===");
cart.applyDiscount("SALE10");
cart.printCart();

console.log("\n=== KIỂM TRA SỐ LƯỢNG VÀ THAO TÁC XÓA MÓN ĂN/ĐỒ ĐIỆN TỬ ===");
console.log("Số SP hiện tại trong giỏ (Tổng số lượng):", cart.getItemCount()); // → Kỳ vọng: 4 (2 iPhone + 2 AirPods)

cart.removeItem(3); // Xóa hoàn toàn AirPods Pro (id: 3) ra khỏi giỏ
console.log("Sau khi xóa AirPods Pro, Số SP còn lại:", cart.getItemCount()); // → Kỳ vọng: 2 (Còn lại 2 iPhone)

// In lại bảng cuối cùng để xác nhận giỏ hàng đã thay đổi sạch sẽ
cart.printCart();