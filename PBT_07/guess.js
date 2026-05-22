/**
 * Hàm chứa toàn bộ logic vận hành của Mini Game Đoán số
 */
function playGame() {
    // 1. Máy tính sinh số ngẫu nhiên trong khoảng từ 1 đến 100
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    
    // Khởi tạo các biến quản lý trạng thái trò chơi
    const maxAttempts = 7;      // Giới hạn tối đa 7 lần đoán
    let attempts = 0;           // Biến đếm số lần đã đoán
    let isCorrect = false;      // Đánh dấu trạng thái chiến thắng
    const guessedHistory = [];  // Mảng lưu vết lịch sử các số đã đoán để check trùng

    alert("Trò chơi bắt đầu! Hãy đoán một số từ 1 đến 100.");

    // Vòng lặp kiểm soát luồng trò chơi dựa trên số lượt đoán còn lại
    while (attempts < maxAttempts) {
        let remainingAttempts = maxAttempts - attempts;
        
        // Hiển thị hộp thoại nhập số, hiển thị luôn số lượt còn lại để tăng trải nghiệm
        let input = prompt(`Lượt đoán thứ ${attempts + 1}/${maxAttempts} (Còn ${remainingAttempts} lượt):\nNhập con số bạn đoán (1-100):`);
        
        // Xử lý trường hợp người dùng nhấn nút "Cancel" (Hủy bỏ) trên hộp thoại prompt
        if (input === null) {
            alert("Bạn đã hủy bỏ lượt chơi.");
            return; 
        }

        // Ép kiểu dữ liệu từ chuỗi nhập vào sang số nguyên
        let guess = parseInt(input.trim(), 10);

        // --- BƯỚC VALIDATE INPUT (KIỂM TRA TÍNH HỢP LỆ) ---
        if (isNaN(guess) || guess < 1 || guess > 100) {
            alert("Cảnh báo: Lỗi nhập liệu! Vui lòng chỉ nhập số nguyên nằm trong khoảng từ 1 đến 100.");
            continue; // Bỏ qua đoạn code phía dưới, quay lại vòng lặp và không tính lượt đoán lỗi này
        }

        // --- BƯỚC KIỂM TRA TRÙNG SỐ ---
        let isDuplicated = false;
        for (let i = 0; i < guessedHistory.length; i++) {
            if (guessedHistory[i] === guess) {
                isDuplicated = true;
                break;
            }
        }

        if (isDuplicated) {
            alert(`Bạn đã đoán số ${guess} này rồi! Hãy chọn một con số khác.`);
            continue; // Không tính lượt đoán nếu người dùng nhập trùng số cũ
        }

        // Nếu qua hết các tầng lọc, tiến hành ghi nhận số hợp lệ vào lịch sử và tăng biến đếm lượt
        guessedHistory.push(guess);
        attempts++;

        // --- BƯỚC KIỂM TRA ĐÁP ÁN (LOGIC SO SÁNH) ---
        if (guess === targetNumber) {
            isCorrect = true;
            alert(`Đúng rồi! Chúc mừng bạn đã đoán trúng con số ${targetNumber} sau ${attempts} lần đoán!`);
            break; // Thoát ngay khỏi vòng lặp vì đã chiến thắng
        } else if (guess > targetNumber) {
            alert("Thấp hơn!");
        } else {
            alert("Cao hơn!");
        }
    }

    // --- BƯỚC KẾT THÚC GAME: XỬ LÝ TRƯỜNG HỢP THUA CUỘC ---
    if (!isCorrect) {
        alert(`Hết lượt! Bạn đã thua cuộc.\nĐáp án chính xác của máy tính là: ${targetNumber}`);
    }
}