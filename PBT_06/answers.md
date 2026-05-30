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

# CÂU A2 — UTILITIES & COMPONENTS

---

## 1. Giải thích Class phối hợp `d-none d-md-block`

Đây là bộ đôi Utility Class rất phổ biến dùng để ẩn/hiển thị phần tử theo kích thước màn hình (Responsive Display). Cơ chế hoạt động dựa trên nguyên lý ghi đè từ màn hình nhỏ đến màn hình lớn (Mobile-First):

* **`d-none` (Display None):** Có tác dụng ẩn hoàn toàn phần tử trên **tất cả** các kích thước màn hình (bắt đầu từ mốc cực tiểu `0px` trở lên). Phần tử sẽ bị biến mất khỏi giao diện và không chiếm bất kỳ không gian nào.
* **`d-md-block` (Display Medium Block):** Có tác dụng ép phần tử hiển thị lại dưới dạng khối (`display: block`) khi màn hình đạt kích thước **từ mốc `md` trở lên (≥ 768px)**, ghi đè hoàn toàn lệnh `d-none` trước đó.

###  Trạng thái ẩn/hiển thị thực tế của Element:
* **Ẩn khi nào:** Khi người dùng truy cập bằng thiết bị màn hình nhỏ như **Điện thoại di động (Mobile)** có độ rộng **nhỏ hơn 768px** (Mốc màn hình `xs` và `sm`).
* **Hiển thị khi nào:** Khi màn hình đạt độ rộng **từ 768px trở lên** bao gồm các thiết bị như **Máy tính bảng (Tablet)** đặt nằm ngang, **Máy tính xách tay (Laptop)**, và **Màn hình máy tính bàn (Desktop)** (Mốc màn hình `md`, `lg`, `xl`, `xxl`).

>  **Ứng dụng thực tế:** Thường dùng để làm ẩn các thanh Menu điều hướng cồng kềnh trên Mobile và chỉ cho hiện ra khi xem bằng máy tính Desktop.

---

## 2. Liệt kê và giải thích 5 Spacing Utilities (Margin / Padding)

Hệ thống Spacing của CSS Framework sử dụng công thức viết tắt: `{thuộc tính}{hướng}-{mức độ}` để căn chỉnh khoảng cách một cách nhanh chóng.

| Tên Utility Class | Thuộc tính dịch nghĩa | Giải thích cơ chế hoạt động bản chất |
| :--- | :--- | :--- |
| **`mt-3`** | **M**argin **T**op - Mức **3** | Tạo một khoảng trống bên ngoài **phía trên** của phần tử. Giá trị mức 3 thường tương đương với `1rem` (khoảng `16px`). |
| **`px-4`** | **P**adding **X-axis** - Mức **4** | Tạo khoảng trống đệm bên trong phần tử theo trục X (bao gồm cả vế **Trái - Left** và vế **Phải - Right**). Mức 4 tương đương `1.5rem` (`24px`). |
| **`mb-auto`** | **M**argin **B**ottom - **Auto** | Tự động tính toán khoảng trống phía dưới của phần tử. Trong hệ thống Flexbox, class này sẽ đẩy tất cả các phần tử đồng cấp đứng phía sau nó dạt xuống dưới cùng. |
| **`ms-2`** | **M**argin **S**tart - Mức **2** | Tạo khoảng trống bên ngoài ở phía **Bắt đầu** (chính là phía **Trái - Left** đối với ngôn ngữ đọc từ trái sang phải). Mức 2 tương đương `0.5rem` (`8px`). |
| **`py-5`** | **P**adding **Y-axis** - Mức **5** | Tạo khoảng trống đệm bên trong phần tử theo trục Y (bao gồm cả vế **Trên - Top** và vế **Dưới - Bottom**). Mức 5 là mốc lớn nhất mặc định, tương đương `3rem` (`48px`). |

---

## 3. Phân biệt `.container`, `.container-fluid`, và `.container-md`

Cả 3 class này đều đóng vai trò làm **Khối bọc ngoài cùng (Layout Wrapper)** để chứa hệ thống lưới `row` và `col`, nhưng chúng có hành vi co giãn độ rộng khác nhau:

### A. `.container` (Khối chứa có điểm biên cố định)
* **Đặc điểm:** Độ rộng sẽ thay đổi theo từng nấc (Responsive Fixed Width). Tại mỗi kích thước màn hình (`sm`, `md`, `lg`, ...), nó sẽ tự đặt ra một giới hạn chiều rộng tối đa (`max-width`) cố định (Ví dụ: Trên Desktop rộng 1200px, nó chỉ thu gọn lại chiếm 1140px và căn giữa, tạo ra 2 khoảng lề trống hai bên).
* **Phù hợp cho:** Các website dạng truyền thống cần gom nội dung vào giữa trang để người dùng dễ tập trung đọc thông tin.

### B. `.container-fluid` (Khối chứa tràn viền)
* **Đặc điểm:** Luôn luôn chiếm trọn vẹn **100% chiều rộng** (`width: 100%`) của trình duyệt ở **bất kỳ kích thước màn hình nào**, từ điện thoại siêu nhỏ cho đến tivi màn hình phẳng cực đại. Không bao giờ xuất hiện hai khoảng lề trống cố định ở hai bên.
* **Phù hợp cho:** Các ứng dụng Dashboard quản trị, Bản đồ (Maps), hoặc các trang web thiết kế theo phong cách hiện đại tràn màn hình.

### C. `.container-md` (Khối chứa lai hợp - Hybrid)
* **Đặc điểm:** Là sự kết hợp linh hoạt dựa trên mốc breakpoint `md` (768px):
  * Khi màn hình **nhỏ hơn 768px** (Mobile): Nó hoạt động giống y hệt `.container-fluid`, tức là **tràn viền 100%** để tiết kiệm không gian hiển thị cho màn hình nhỏ.
  * Khi màn hình **từ 768px trở lên** (Tablet, Desktop): Nó lập tức "biến hình" hoạt động giống `.container`, tức là **bị giới hạn độ rộng cố định** và co vào giữa trang.
* **Phù hợp cho:** Các bài viết báo điện tử, trang tin tức cần tối ưu trải nghiệm đọc trên di động nhưng vẫn vuông vức trên màn hình máy tính.