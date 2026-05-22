# PHẦN A — KIỂM TRA ĐỌC HIỂU
# CÂU A1 — VAR / LET / CONST

## 1. Bảng dự đoán và Kết quả thực tế

| Đoạn code | Dự đoán / Kết quả thực tế | Loại lỗi (Nếu có) | Bản chất cơ chế kỹ thuật vận hành |
| :--- | :--- | :--- | :--- |
| **Đoạn 1** | `undefined` | Không lỗi | **Cơ chế Hoisting của `var`**: Biến được đem lên đầu phạm vi nhưng chưa mang giá trị khởi tạo, nhận giá trị mặc định là `undefined`. |
| **Đoạn 2** | Không in ra gì | `ReferenceError` | **Temporal Dead Zone (TDZ)**: Biến `let` bị khóa trong vùng chết tạm thời, không cho phép truy cập trước dòng khai báo. |
| **Đoạn 3** | Không in ra gì | `TypeError` | **Tính bất biến của `const`**: Không được phép sử dụng toán tử `=` để tái gán (re-assign) một giá trị mới vào biến hằng số. |
| **Đoạn 4** | `[1, 2, 3, 4]` | Không lỗi | **Tính đột biến (Mutation)**: `const` bảo vệ địa chỉ ô nhớ mảng chứ không cấm chỉnh sửa (push/pop) nội dung bên trong mảng đó. |
| **Đoạn 5** | Trong block: `2`<br>Ngoài block: `1` | Không lỗi | **Phạm vi khối (Block Scope)**: Từ khóa `let` định danh biến độc lập bên trong cặp dấu `{}` mà không làm ảnh hưởng biến trùng tên ở ngoài. |

---

## 2. Giải thích chuyên sâu các hiện tượng JavaScript cốt lõi

### Hiện tượng 1: Phân biệt Hoisting giữa `var` và `let` (Đoạn 1 & Đoạn 2)
* **Với `var x = 5`:** Trình biên dịch tự động tách lệnh thành `var x;` (đẩy lên đỉnh đầu) và `x = 5;` (giữ nguyên vị trí). Do đó lệnh `console.log(x)` chạy ở giữa sẽ lấy được cái vỏ biến rỗng, trả về giá trị `undefined`.
* **Với `let y = 10`:** Biến `let` thực chất vẫn bị hoisting ngầm, nhưng JavaScript thiết lập một rào chắn bảo vệ nghiêm ngặt gọi là **Temporal Dead Zone (Vùng chết tạm thời)** từ đầu block cho tới dòng code khai báo nó. Mọi hành động gọi biến nằm trong vùng này đều bị trình duyệt chặn lại và báo lỗi `ReferenceError` để bảo vệ an toàn cho luồng dữ liệu.

### Hiện tượng 2: Tại sao `const` mảng lại thay đổi được dữ liệu? (Đoạn 4)
* Trong JavaScript, **Mảng (Array)** và **Đối tượng (Object)** thuộc nhóm kiểu dữ liệu tham chiếu (Reference Type). 
* Khi ta viết `const arr = [1, 2, 3]`, hằng số `arr` không trực tiếp lưu trữ các con số `1, 2, 3`, mà nó chỉ lưu giữ một **địa chỉ trỏ tới ô nhớ** chứa cái mảng đó.
* Lệnh `arr.push(4)` chỉ thay đổi nội dung bên trong ô nhớ (gọi là mutation), bản thân địa chỉ ô nhớ được lưu trong `arr` hoàn toàn giữ nguyên, không hề bị thay đổi hay ghi đè bằng địa chỉ mới. Vì vậy, trình duyệt chấp nhận lệnh này là hoàn toàn hợp lệ.

# CÂU A2 — DATA TYPES & COERCION

## 1. Bảng dự đoán và Kết quả thực tế

| Dòng code | Dự đoán / Kết quả thực tế | Giải thích bản chất kỹ thuật |
| :--- | :--- | :--- |
| `typeof null` | `"object"` | Đây là một lỗi lịch sử (bug) từ phiên bản JavaScript đầu tiên nhưng không được sửa để giữ tính tương thích toàn cầu. |
| `typeof undefined` | `"undefined"` | `undefined` là một kiểu dữ liệu nguyên thủy riêng biệt, đại diện cho một biến chưa được khởi tạo giá trị. |
| `typeof NaN` | `"number"` | *Not-a-Number* đại diện cho một kết quả toán học vô lý, nhưng về mặt phân loại bộ nhớ, nó vẫn thuộc kiểu số. |
| `"5" + 3` | `"53"` | Toán tử `+` gặp một vế là chuỗi sẽ kích hoạt cơ chế **ghép chuỗi** (String concatenation). Số 3 biến thành chuỗi "3". |
| `"5" - 3` | `2` | Toán tử `-` chỉ làm toán. JavaScript kích hoạt **ép kiểu số** (Numeric coercion), biến chuỗi "5" thành số 5. |
| `"5" * "3"` | `15` | Tương tự phép trừ, phép nhân ép cả hai chuỗi về kiểu số để thực hiện tính toán toán học. |
| `true + true` | `2` | Kiểu Boolean được ép sang kiểu số khi làm toán: giá trị `true` tương đương với số `1` (Ta có: 1 + 1 = 2). |
| `[] + []` | `""` (Chuỗi rỗng) | Mảng trống khi ép về chuỗi bằng hàm ngầm định `toString()` sẽ ra chuỗi rỗng `""`. Kết quả là `"" + ""` = `""`. |
| `[] + {}` | `"[object Object]"` | Mảng `[]` biến thành `""`. Đối tượng `{}` biến thành chuỗi mặc định `"[object Object]"`. |
| `{} + []` | `"[object Object]"` | Trong hàm in, đối tượng `{}` đầu tiên được định giá trị thành chuỗi trước khi tiến hành cộng nối với mảng rỗng. |

---

## 2. Phân tích chuyên sâu: Tại sao `"5" + 3` và `"5" - 3` cho kết quả khác nhau?

Sự khác biệt mang tính kinh điển này nằm ở **sự đa năng của toán tử `+`** so với toán tử `-` trong JavaScript:

* **Trường hợp `"5" + 3`:** Do toán tử `+` có hai nhiệm vụ (vừa làm toán cộng, vừa làm nhiệm vụ nối ký tự văn bản). JavaScript có quy tắc tối cao: *Chỉ cần 1 trong 2 vế là chuỗi, vế còn lại bị ép thành chuỗi để nối*. Do đó số `3` biến thành `"3"` và dính liền vào sau `"5"` tạo ra `"53"`.
* **Trường hợp `"5" - 3`:** Toán tử `-` thì không đa năng như vậy, nó chỉ biết làm duy nhất một việc là làm phép toán trừ. Vì thế, khi thấy chuỗi `"5"`, JavaScript hiểu rằng bạn đang muốn làm toán nên nó ép kiểu số ngầm định (Numeric Coercion) dịch chuyển `"5"` thành số `5`. Phép toán trở thành `5 - 2` và cho ra kết quả bằng `2`.

# CÂU A3 — SO SÁNH == VS ===

## 1. Bảng dự đoán và Kết quả thực tế

| Dòng code | Dự đoán / Kết quả thực tế | Giải thích bản chất cơ chế vận hành ngầm |
| :--- | :--- | :--- |
| `5 == "5"` | `true` | **Toán tử so sánh trừu tượng (Loose Equality)**: Ép kiểu chuỗi `"5"` về số `5` trước khi so sánh giá trị ($5 = 5$). |
| `5 === "5"` | `false` | **Toán tử so sánh nghiêm ngặt (Strict Equality)**: So sánh cả giá trị lẫn kiểu dữ liệu. Vì số (`number`) khác chuỗi (`string`) nên trả về `false`. |
| `null == undefined` | `true` | Đây là một **quy tắc đặc biệt** trong đặc tả ECMAScript. `null` và `undefined` bằng nhau khi dùng `==` và chúng không bằng bất kỳ giá trị nào khác. |
| `null === undefined` | `false` | Kiểu dữ liệu của `null` (được định danh là `object` do lỗi lịch sử) hoàn toàn khác biệt với kiểu dữ liệu `undefined`. |
| `NaN == NaN` | `false` | **Quy tắc đặc biệt**: Giá trị `NaN` (Not-a-Number) là thực thể duy nhất trong JavaScript **không bao giờ tự bằng chính nó**, dù so sánh bằng `==` hay `===`. |
| `0 == false` | `true` | Giá trị `false` thuộc kiểu Boolean được ép ngầm định về kiểu số là `0`. Phép toán trở thành $0 = 0$, trả về `true`. |
| `0 === false` | `false` | Kiểu dữ liệu `number` (của số 0) không trùng khớp với kiểu dữ liệu `boolean` (của giá trị false). |
| `"" == false` | `true` | Cả hai vế đều bị ép kiểu ngầm định về số `0` để thực hiện so sánh trừu tượng ($0 = 0$). |

---

## 2. Quy tắc cốt lõi: Nên sử dụng `==` hay `===` từ giờ trở đi?

### Câu trả lời: Luôn luôn ưu tiên sử dụng toán tử `===` (và `!==`) trong mọi tình huống thực tế.

### Tại sao?
1. **Tránh bẫy logic (Kịch bản lỗi ngầm):** Như đã thấy ở bảng trên, toán tử `==` tự ý ép kiểu dữ liệu ngầm định theo những quy tắc rất phức tạp và khó kiểm soát (ví dụ như biến `""` hay `[]` thành số `0`). Điều này cực kỳ dễ tạo ra những lỗ hổng logic tinh vi trong hệ thống lớn mà trình duyệt không hề báo lỗi (Crash).
2. **Đảm bảo tính chính xác và an toàn của dữ liệu:** Sử dụng `===` bắt buộc dữ liệu đầu vào phải trùng khớp hoàn toàn cả về bản chất (Kiểu dữ liệu) lẫn giá trị. Điều này giúp mã nguồn của bạn chạy tường minh, minh bạch, dễ đọc (Readable) và dễ gỡ lỗi (Maintainable).
3. **Hiệu năng xử lý nhanh hơn (Performance):** Vì toán tử `===` bỏ qua hoàn toàn bước kiểm tra và ép kiểu dữ liệu phức tạp, nó so sánh trực tiếp các byte bộ nhớ nên về mặt lý thuyết, tốc độ xử lý của nó sẽ tối ưu hơn so với `==`.

*Ngoại lệ duy nhất:* Đôi khi lập trình viên dùng `if (variable == null)` để kiểm tra nhanh xem một biến có phải là `null` hoặc `undefined` hay không (vì dòng này tương đương với `if (variable === null || variable === undefined)`). Tuy nhiên, để đảm bảo an toàn tuyệt đối, việc viết tường minh với `===` vẫn được các hệ thống Linting (như ESLint) và các công ty công nghệ lớn quy định bắt buộc.

# CÂU A4 — TRUTHY & FALSY

## 1. Danh sách TẤT CẢ các giá trị Falsy trong JavaScript

Trong JavaScript, **Falsy** là những giá trị mà khi bị ép kiểu về dạng Boolean trong các câu lệnh điều kiện (như `if`, vòng lặp...), chúng sẽ tự động chuyển dịch về giá trị `false`. 

Hiện tại, JavaScript chỉ có chính xác **8 giá trị Falsy** sau đây:
1. `false` (Chính bản thân từ khóa boolean false).
2. `0` (Số không).
3. `-0` (Số âm không).
4. `0n` (Kiểu BigInt số không).
5. `""`, `''`, `\`` (Chuỗi văn bản rỗng, hoàn toàn không chứa ký tự nào bên trong).
6. `null` (Giá trị rỗng/vô giá trị).
7. `undefined` (Biến chưa được khởi tạo, định nghĩa).
8. `NaN` (Trạng thái kết quả toán học vô lý - Not-a-Number).

*Lưu ý: Tất cả các giá trị nằm ngoài danh sách 8 thực thể trên thì mặc định đều là **Truthy** (tự động chuyển thành `true` trong câu lệnh `if`).*

---

## 2. Bảng dự đoán và Kết quả thực tế câu lệnh Điều kiện

| Dòng code | Tính chất của vế điều kiện | Dự đoán / Kết quả thực tế | Giải thích bản chất cơ chế |
| :--- | :--- | :--- | :--- |
| `if ("0")` | **Truthy** | **CÓ IN** chữ "A" | Đây là một chuỗi văn bản **không rỗng** (chứa ký tự ký hiệu số 0). Bất kỳ chuỗi nào có ký tự đều là Truthy. |
| `if ("")` | **Falsy** | **KHÔNG IN** | Chuỗi hoàn toàn trống rỗng (String length = 0), thuộc nhóm 8 giá trị Falsy. |
| `if ([])` | **Truthy** | **CÓ IN** chữ "C" | **Mảng rỗng** vẫn là một Object (kiểu dữ liệu tham chiếu). Mọi Object/Array dù trống rỗng hay không đều luôn là Truthy. |
| `if ({})` | **Truthy** | **CÓ IN** chữ "D" | **Đối tượng rỗng** tương tự như mảng rỗng, bộ nhớ đã cấp phát một Object nên nó luôn là Truthy. |
| `if (null)` | **Falsy** | **KHÔNG IN** | Nằm trong danh sách 8 giá trị Falsy mặc định của ngôn ngữ. |
| `if (0)` | **Falsy** | **KHÔNG IN** | Số không đại diện cho trạng thái tắt/sai cấu trúc, thuộc nhóm Falsy. |
| `if (-1)` | **Truthy** | **CÓ IN** chữ "G" | Trong JavaScript, chỉ có số `0` và `-0` mới là Falsy. Mọi số nguyên âm hoặc dương khác không (`-1`, `1`, `100`...) đều là Truthy. |
| `if (" ")` | **Truthy** | **CÓ IN** chữ "H" | Chuỗi này có chứa **1 dấu cách (khoảng trắng/space)** nên nó không phải là chuỗi rỗng. Do đó nó là Truthy. |