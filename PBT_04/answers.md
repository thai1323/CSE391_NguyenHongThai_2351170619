**PHẦN A — KIỂM TRA ĐỌC HIỂU**
**Câu A1 — 5 Loại Positioning**

1. static (Mặc định),CÓ,"Theo luồng tự nhiên từ trên xuống, trái sang phải.",CÓ,"Bố cục văn bản, các khối nội dung chuẩn bình thường.
2. relative,CÓ,Vị trí chính nó ban đầu nếu không dịch chuyển.,CÓ,Làm điểm tựa (gốc tọa độ) cho con dùng absolute bám vào.
3. absolute,KHÔNG (Bị nhấc khỏi flow),Nearest positioned ancestor (Tổ tiên gần nhất có position khác static).,CÓ,"Làm icon badge (thông báo số), nút Đóng (X) trên góc modal."
4. fixed,KHÔNG (Bị nhấc khỏi flow),Viewport (Khung hình hiển thị của trình duyệt).,KHÔNG (Đứng im một chỗ),"Thanh Chatbot góc dưới, Nút ""Back to Top"", Modal popup cố định."
5. sticky,CÓ (Sau đó biến thành fixed khi đạt mốc),Thẻ cha trực tiếp và thanh cuộn của trình duyệt.,CÓ (Cuộn cho tới khi hết phạm vi thẻ cha),Thanh Menu điều hướng luôn dính ở đỉnh trang khi cuộn xuống.

Câu hỏi thêm:
Khái niệm "Nearest positioned ancestor" (Tổ tiên được định vị gần nhất): > Là thẻ bao ngoài gần nhất (có thể là cha, ông, cụ,...) có thuộc tính position được thiết lập một giá trị khác biệt hoàn toàn với static (ví dụ như có relative, absolute, hoặc fixed).

Khi nào absolute tham chiếu body:
Trường hợp: Khi phần tử absolute đó không có bất kỳ một thẻ tổ tiên bao ngoài nào (cha, ông, cụ...) được cấu hình position (tức là tất cả các thẻ bao ngoài đều mang giá trị mặc định static).
Hệ quả: Điểm gốc $(0,0)$ để tính tọa độ top, bottom, left, right sẽ được đẩy ra ngoài cùng và lấy theo phần tử gốc của trang (body hoặc chuẩn xác là html viewport ban đầu).

Khi nào absolute tham chiếu parent (thẻ cha):
Trường hợp: Khi thẻ cha trực tiếp (hoặc một thẻ tổ tiên bao ngoài gần nó nhất) được gán thuộc tính position: relative; (hoặc absolute, fixed).
Hệ quả: Thẻ absolute con sẽ bị "khóa chặt" gốc tọa độ vào khung viền của thẻ cha đó. Toàn bộ các lệnh dịch chuyển vị trí sẽ chỉ chạy quanh quẩn bên trong phạm vi của thẻ cha chứ không bị tràn ra toàn trang web.
**Câu A2 — Flexbox vs Grid**
1. Trường hợp 1 
Dự đoán: 4 items nằm trên cùng 1 hàng ngang, chia đều chiều rộng bằng nhau.
Giải thích: display: flex mặc định xếp các phần tử theo hàng ngang. Thuộc tính flex: 1 ép tất cả các items tự động co giãn để chiếm trọn không gian trống của container với tỉ lệ bằng khít nhau.
Sơ đồ bố cục:
+-------------------------------------------------------+
| [ Item 1 ]  |  [ Item 2 ]  |  [ Item 3 ]  |  [ Item 4 ] |
+-------------------------------------------------------+
2. Trường hợp 2
Dự đoán: Bố cục gồm 3 hàng, mỗi hàng có đúng 2 cột.
Giải thích: Mỗi item chiếm width: 45% + lề margin: 2.5% cả 2 bên trái phải (tổng cộng chiếm 45% + 2.5% x 2 = 50% chiều rộng). Do đó, một hàng chỉ chứa vừa khít 2 items (50% x 2 = 100\%). Nhờ có flex-wrap: wrap, 4 items còn lại sẽ tự động ngắt dòng và rớt xuống tạo thành 3 hàng đều đặn.
Sơ đồ bố cục:
+-------------------------------------------------------+
|  [   Item 1   ] (50%)      |  [   Item 2   ] (50%)    |
|  [   Item 3   ]            |  [   Item 4   ]          |
|  [   Item 5   ]            |  [   Item 6   ]          |
+-------------------------------------------------------+
3. Trường hợp 3
Dự đoán: 3 items nằm trên 1 hàng ngang. Cột 1 sát lề trái, cột 3 sát lề phải, cột 2 nằm chính giữa. Cả 3 căn giữa hoàn hảo theo chiều dọc.
Giải thích: justify-content: space-between đẩy các item ra xa nhau tạo khoảng trống ở giữa, ép item đầu và cuối dính chặt vào viền container. align-items: center giúp căn các phần tử thẳng hàng theo trục dọc (trục phụ).
Sơ đồ bố cục:
+-------------------------------------------------------+
|                                                       |
| [ Item 1 ]             [ Item 2 ]             [ Item 3 ]|
|                                                       |
+-------------------------------------------------------+
4. Trường hợp 4
Dự đoán: 3 items nằm trên 1 hàng ngang. Cột 1 rộng 200px, cột 3 rộng 200px, cột 2 ở giữa tự động co giãn chiếm toàn bộ không gian còn lại. Khoảng cách giữa các cột là 20px.
Giải thích: grid-template-columns định nghĩa rõ kích thước 3 cột. Đơn vị 1fr (fractional unit) ở giữa sẽ lấy hết phần diện tích còn thừa của container sau khi đã trừ đi 200px x 2 và 20px x 2 tiền khoảng cách (gap).
Sơ đồ bố cục:
+-------------------------------------------------------+
| [Item 1] |           [     Item 2     ]           | [Item 3] |
|  200px   |               1fr                      |  200px   |
+-------20px-------------------------------------20px---+
5. Trường hợp 5
Dự đoán: Bố cục gồm 3 hàng, 3 cột. Hàng 1 (Item 1, 2, 3); Hàng 2 (Item 4, 5, 6); Hàng 3 duy nhất chỉ có Item 7 nằm ở góc ngoài cùng bên trái dưới cùng.
Giải thích: repeat(3, 1fr) chia container thành lưới 3 cột bằng nhau. Khi phân bổ 7 items vào lưới 3 cột, trình duyệt tự động điền đầy hàng 1 và hàng 2. Phần tử thứ 7 thừa ra sẽ bắt đầu hàng thứ 3 và đặt cố định ở cột đầu tiên (Cột 1), bỏ trống cột 2 và cột 3.
Sơ đồ bố cục:
+-------------------------------------------------------+
|  [  Item 1  ]   |   [  Item 2  ]   |   [  Item 3  ]   |
+-----------------10px---------------10px---------------+
|  [  Item 4  ]   |   [  Item 5  ]   |   [  Item 6  ]   |
+-------------------------------------------------------+
|  [  Item 7  ]   |   (để trống)     |   (để trống)     |
+-------------------------------------------------------+
**PHẦN C — DEBUG & SUY LUẬN**
**Câu C1 — Flexbox vs Grid: Khi nào dùng gì?**
1. Navigation bar ngang (Logo + Menu + Buttons)
Lựa chọn: Flexbox

Giải thích ngắn gọn: Thanh điều hướng là layout 1 chiều (1D) theo trục ngang. Flexbox xử lý cực tốt việc căn chỉnh các phần tử không có kích thước cố định, cho phép logo nằm bên trái và đẩy cụm menu/buttons sang bên phải rất linh hoạt bằng thuộc tính justify-content: space-between.

2. Lưới ảnh Instagram (3 cột đều nhau, số ảnh không biết trước)
Lựa chọn: Grid

Giải thích ngắn gọn: Đây là layout 2 chiều (2D) yêu cầu kiểm soát chặt chẽ cả hàng và cột để tạo thành các ô vuông đều chằn chặn. Với Grid, chỉ cần thiết lập grid-template-columns: repeat(3, 1fr); và grid-auto-rows, trình duyệt sẽ tự động xếp toàn bộ số lượng ảnh phát sinh vào lưới 3 cột một cách hoàn hảo mà không lo bị lệch hàng.

3. Layout blog: Main content + Sidebar
Lựa chọn: Dùng Flexbox hoặc Grid đều được (Ưu tiên Grid cho cấu trúc tổng thể)

Giải thích ngắn gọn: Layout trang chính mang tính chất cấu trúc khung lớn 2 chiều (vừa chia cột cho nội dung/sidebar, vừa chia hàng cho Header/Footer bao ngoài). Grid giúp khóa cứng độ rộng của Sidebar (ví dụ: 300px) và cho phép Content co giãn tự do theo khoảng trống còn lại (1fr) một cách trực quan nhất.

4. Footer với 4 cột thông tin
Lựa chọn: Flexbox (Hoặc Grid nếu muốn các cột bằng khít nhau tuyệt đối)

Giải thích ngắn gọn: Bản chất các cột footer thường chỉ xếp hàng ngang cạnh nhau (1 chiều). Dùng Flexbox với display: flex và justify-content: space-between (hoặc đặt flex: 1 cho các cột con) giúp các khối thông tin tự động dàn đều, co giãn mượt mà và dễ dàng chuyển sang dạng dọc (stack) trên màn hình điện thoại bằng flex-direction: column.

5. Card sản phẩm (Ảnh trên, text giữa, nút dưới — nút luôn dính đáy)
Lựa chọn: Flexbox

Giải thích ngắn gọn: Đây là layout theo chiều dọc (1 chiều). Khi bọc toàn bộ card bằng display: flex; flex-direction: column;, ta chỉ cần gán thêm thuộc tính lề tự động margin-top: auto; cho nút bấm ở dưới cùng. Cơ chế của Flexbox sẽ tự động đẩy nút bấm lao xuống dính chặt vào đáy card, bất kể phần mô tả text ở giữa ngắn hay dài.