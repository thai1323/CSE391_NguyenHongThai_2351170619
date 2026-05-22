**PHẦN A — KIỂM TRA ĐỌC HIỂU**
**Câu A1 — var / let / const**
Dự đoán output

Đoạn code      |     Dự đoán Output / Kết quả thực tế     |    Loại lỗi nếu có
Đoạn 1         |               undefined                  |       Không lỗi
Đoạn 2         |          Không in ra gì cả               |     ReferenceError
Đoạn 3         |           Không in ra gì cả              |       TypeError
Đoạn 4         |             [1, 2, 3, 4]                 |       Không lỗi
Đoạn 5         |            Trong block: 2                |       Không lỗi
               |            Trong block: 1                |
        
So sánh dự đoán vs thực tế

Kết quả chạy file var_let_const.js → đúng như dự đoán.
Kết quả bất ngờ:
    Đoạn 4: Nhiều người nghĩ const = không thay đổi được → sai. const chỉ ngăn gán lại (reassign), không ngăn thay đổi nội dung (mutate).
    ![alt text](<Screenshot 2026-05-22 221304.png>)