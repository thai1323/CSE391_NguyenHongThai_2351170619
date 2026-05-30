### PHẦN A — ĐỌC HIỂU
# CÂU A1 — GRID SYSTEM LAYOUT

## 1. Bảng phân tích kích thước và số lượng cột Grid System

| Kích thước | < 768px | 768px - 991px | ≥ 992px |
| :--- | :--- | :--- | :--- |
| **Số cột chiếm dụng** | 12 cột (Chiếm 100% chiều rộng) | 6 cột (Chiếm 50% chiều rộng) | 3 cột (Chiếm 25% chiều rộng) |
| **Số lượng Box trên 1 hàng** | 1 Box / Hàng | 2 Box / Hàng | 4 Box / Hàng |
| **Sơ đồ Box layout** | 4 hàng dọc xếp chồng | 2 hàng ngang, mỗi hàng 2 ô | 1 hàng ngang duy nhất chứa cả 4 ô |

---

## 2. Mô phỏng cấu trúc sơ đồ giao diện (ASCII Art)

### A. Kích thước nhỏ (< 768px — Mobile): Class `col-12` hoạt động
```text
┌──────────────────────────────────────────────┐
│                    Box 1                     │
├──────────────────────────────────────────────┤
│                    Box 2                     │
├──────────────────────────────────────────────┤
│                    Box 3                     │
├──────────────────────────────────────────────┤
│                    Box 4                     │
└──────────────────────────────────────────────┘

### B. Kích thước trung bình (768px - 991px — Tablet): Class col-md-6 hoạt động
┌───────────────────────┬───────────────────────┐
│         Box 1         │         Box 2         │
├───────────────────────┼───────────────────────┤
│         Box 3         │         Box 4         │
└───────────────────────┴───────────────────────┘
### C. Kích thước lớn (≥ 992px — Desktop): Class col-lg-3 hoạt động
┌───────────┬───────────┬───────────┬───────────┐
│   Box 1   │   Box 2   │   Box 3   │   Box 4   │
└───────────┴───────────┴───────────┴───────────┘
**Câu hỏi thêm:**
ol-md-6 nghĩa là gì?
   col: Viết tắt của Column (Cột) thuộc hệ thống lưới chi phối giao diện.

   md: Viết tắt của Medium Breakpoint (Mốc màn hình trung bình, áp dụng cho các thiết bị máy tính bảng có độ rộng từ 768px đến dưới 992px).

   6: Đại diện cho số lượng cột mà phần tử này sẽ chiếm đóng trên tổng số 12 cột tiêu chuẩn của một hàng (row).

   Ý nghĩa thực tế: Class này báo cho trình duyệt biết: "Khi người dùng xem trang web này bằng màn hình tablet (≥ 768px), hãy dàn độ rộng của Box này bằng đúng 50% chiều ngang của khối mẹ".
Tại sao không cần viết col-sm-12 vào mã nguồn HTML?
    Chúng ta hoàn toàn không cần khai báo col-sm-12 nhờ vào cơ chế đặc thù sau của CSS Grid:

    Nguyên lý Mobile-First (Ưu tiên màn hình nhỏ trước): Hệ lưới của các thư viện CSS hiện đại hoạt động theo quy tắc kế thừa từ dưới lên. Các class định hình cho mốc màn hình nhỏ sẽ tự động duy trì hiệu lực và tràn lên áp dụng cho các mốc màn hình lớn hơn phía trên, trừ khi gặp một class ở breakpoint cao hơn đứng ra ghi đè.

    Cơ chế kế thừa từ col-12: Trong đoạn code, ta đã khai báo class col-12 (có tác dụng từ mốc 0px trở lên). Khi màn hình mở rộng sang mốc sm (Small từ 576px đến 767px), do chúng ta hoàn toàn không viết bất kỳ class chặn dòng nào dạng col-sm-X, phần tử sẽ tự động kế thừa thuộc tính của col-12 trước đó để tiếp tục chiếm trọn 100% không gian. Việc viết thêm col-sm-12 chỉ làm phình to mã nguồn chứ không mang lại giá trị thực tế.