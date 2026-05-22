// ==========================================================================
// CÂU B2: XỬ LÝ DỮ LIỆU SINH VIÊN BẰNG VÒNG LẶP VÀ CÂU LỆNH ĐIỀU KIỆN THUỒN
// ==========================================================================

const students = [
    { name: "An", math: 8, physics: 7, cs: 9, gender: "M" },
    { name: "Bình", math: 6, physics: 9, cs: 7, gender: "F" },
    { name: "Chi", math: 9, physics: 6, cs: 8, gender: "F" },
    { name: "Dũng", math: 5, physics: 5, cs: 6, gender: "M" },
    { name: "Em", math: 10, physics: 8, cs: 9, gender: "F" },
    { name: "Phong", math: 3, physics: 4, cs: 5, gender: "M" },
    { name: "Giang", math: 7, physics: 7, cs: 7, gender: "F" },
    { name: "Huy", math: 4, physics: 6, cs: 3, gender: "M" },
];

// Khởi tạo các biến tích lũy để tính toán thống kê (Không dùng hàm mảng nâng cao)
let countGioi = 0;
let countKha = 0;
let countTb = 0;
let countYeu = 0;

let highestGpa = -1;
let lowestGpa = 11;
let highestStudent = "";
let lowestStudent = "";

let totalMath = 0;
let totalPhysics = 0;
let totalCs = 0;

let totalGpaMale = 0;
let countMale = 0;
let totalGpaFemale = 0;
let countFemale = 0;

// Mảng tạm để lưu thông tin đã tính toán nhằm phục vụ in bảng sau đó
const processedStudents = [];

// ==========================================
// 1 & 2. XỬ LÝ LOGIC TỪNG SINH VIÊN (VÒNG LẶP THUỒN)
// ==========================================
for (let i = 0; i < students.length; i++) {
    const s = students[i];

    // 1. Tính điểm trung bình (Hệ số: Toán 0.4, Lý 0.3, CS 0.3)
    let gpa = s.math * 0.4 + s.physics * 0.3 + s.cs * 0.3;
    // Làm tròn lấy 1 chữ số thập phân bằng toán tử số học cơ bản
    gpa = Math.round(gpa * 10) / 10;

    // 2. Xếp loại học lực bằng cấu trúc rẽ nhánh If/Else
    let rank = "";
    if (gpa >= 8.0) {
        rank = "Giỏi";
        countGioi++;
    } else if (gpa >= 6.5) {
        rank = "Khá";
        countKha++;
    } else if (gpa >= 5.0) {
        rank = "Trung bình";
        countTb++;
    } else {
        rank = "Yếu";
        countYeu++;
    }

    // Lưu trữ thông tin phục vụ yêu cầu số 3
    processedStudents.push({ name: s.name, gpa: gpa.toFixed(1), rank: rank });

    // 5. Cập nhật tìm kiếm biên điểm TB Cao nhất / Thấp nhất
    if (gpa > highestGpa) {
        highestGpa = gpa;
        highestStudent = s.name;
    }
    if (gpa < lowestGpa) {
        lowestGpa = gpa;
        lowestStudent = s.name;
    }

    // 6. Tích lũy điểm từng môn để tính điểm trung bình lớp
    totalMath += s.math;
    totalPhysics += s.physics;
    totalCs += s.cs;

    // 7. Thống kê theo điều kiện giới tính
    if (s.gender === "M") {
        totalGpaMale += gpa;
        countMale++;
    } else if (s.gender === "F") {
        totalGpaFemale += gpa;
        countFemale++;
    }
}

// ==========================================
// 3. IN BẢNG KẾT QUẢ THEO ĐÚNG ĐỊNH DẠNG ĐỀ BÀI
// ==========================================
console.log("| STT | Tên     | TB   | Xếp loại     |");
console.log("|-----|---------|------|--------------|");
for (let i = 0; i < processedStudents.length; i++) {
    const s = processedStudents[i];
    // PadStart và padEnd hỗ trợ căn lề chữ cho bảng vuông vức
    const stt = String(i + 1).padEnd(3);
    const name = s.name.padEnd(7);
    const gpa = s.gpa.padEnd(4);
    const rank = s.rank.padEnd(12);
    console.log(`| ${stt} | ${name} | ${gpa} | ${rank} |`);
}

// ==========================================
// 4, 5, 6, 7. IN BÁO CÁO THỐNG KÊ CHI TIẾT
// ==========================================
console.log("\n==========================================");
console.log(" THỐNG KÊ CHI TIẾT BÀI TẬP B2");
console.log("==========================================");

// 4. Số lượng sinh viên theo từng phân khúc phân loại
console.log(`4. Số lượng SV mỗi xếp loại:`);
console.log(`   - Giỏi:      ${countGioi} SV`);
console.log(`   - Khá:       ${countKha} SV`);
console.log(`   - Trung bình: ${countTb} SV`);
console.log(`   - Yếu:       ${countYeu} SV`);

// 5. Kết quả sinh viên xuất sắc nhất và yếu nhất
console.log(`\n5. Sinh viên có điểm TB cao nhất: ${highestStudent} (${highestGpa.toFixed(1)})`);
console.log(`   Sinh viên có điểm TB thấp nhất: ${lowestStudent} (${lowestGpa.toFixed(1)})`);

// 6. Điểm trung bình toàn lớp chia theo từng bộ môn đầu điểm
const classAvgMath = Math.round((totalMath / students.length) * 10) / 10;
const classAvgPhysics = Math.round((totalPhysics / students.length) * 10) / 10;
const classAvgCs = Math.round((totalCs / students.length) * 10) / 10;

console.log(`\n6. Điểm trung bình môn toàn lớp:`);
console.log(`   - Toán (Math):   ${classAvgMath.toFixed(1)}`);
console.log(`   - Vật lý (Phys): ${classAvgPhysics.toFixed(1)}`);
console.log(`   - Tin học (CS):  ${classAvgCs.toFixed(1)}`);

// 7. Bonus: Điểm trung bình phân loại theo giới tính sinh học
const avgGpaMale = countMale > 0 ? Math.round((totalGpaMale / countMale) * 10) / 10 : 0;
const avgGpaFemale = countFemale > 0 ? Math.round((totalGpaFemale / countFemale) * 10) / 10 : 0;

console.log(`\n7. [Bonus] Điểm trung bình theo giới tính:`);
console.log(`   - Nam (M): ${avgGpaMale.toFixed(1)}`);
console.log(`   - Nữ (F):  ${avgGpaFemale.toFixed(1)}`);
console.log("==========================================");