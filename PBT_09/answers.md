## PHẦN A — KIỂM TRA ĐỌC HIỂU 

### Câu A1 — DOM Tree
1. Sơ đồ cây DOM (DOM Tree)
Cấu trúc phân cấp các nút phần tử (Element Nodes) trong cây DOM từ gốc #app được biểu diễn trực quan như sau:
┌─────────────────── document ───────────────────┐
       │                                                │
       ▼                                                ▼
┌─────────────┐                                  ┌─────────────┐
│  Text Node  │                                  │ Element Node│
│  (Whitespace)                                  │    <html>   │
└─────────────┘                                  └──────┬──────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │    <body>   │
                                                 └──────┬──────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │ div (#app)  │
                                                 └──────┬──────┘
                             ┌──────────────────────────┴──────────────────────────┐
                             ▼                                                     ▼
                      ┌─────────────┐                                       ┌─────────────┐
                      │   header    │                                       │    main     │
                      └──────┬──────┘                                       └──────┬──────┘
              ┌──────────────┴──────────────┐                       ┌──────────────┴──────────────┐
              ▼                             ▼                       ▼                             ▼
       ┌─────────────┐               ┌─────────────┐         ┌─────────────┐               ┌─────────────┐
       │     h1      │               │     nav     │         │ form(#todoForm)             │ ul(#todoList)
       └──────┬──────┘               └──────┬──────┘         └──────┬──────┘               └──────┬──────┘
              ▼                             │                       │                             │
       ┌─────────────┐       ┌──────────────┼──────────────┐        │                     ┌───────┴───────┐
       │  Text Node  │       ▼              ▼              ▼        │                     ▼               ▼
       │ "Todo App"  │   ┌───────┐      ┌───────┐      ┌───────┐    │                 ┌───────┐       ┌───────┐
       └─────────────┘   │ a(.active)   │   a   │      │   a   │    │                 │  li   │       │  li   │
                         └───┬───┘      └───┬───┘      └───┬───┘    │                 │(.todo-item)   │(.completed)
                             ▼              ▼              ▼        │                 └───┬───┘       └───┬───┘
                         ┌───────┐      ┌───────┐      ┌───────┐    │                     ▼               ▼
                         │ Text  │      │ Text  │      │ Text  │    │                 ┌───────┐       ┌───────┐
                         │ "All" │      │"Active"      │"Completed" │                 │ Text  │       │ Text  │
                         └───────┘      └───────┘      └───────┘    │                 │"Learn │       │"Learn │
                                                                    │                 │ HTML" │       │ CSS"  │
                                            ┌───────────────────────┴─────────────────┘       └───────┘
                                            ▼                                         ▼
                                     ┌─────────────┐                           ┌─────────────┐
                                     │    input    │                           │   button    │
                                     │(#todoInput) │                           └──────┬──────┘
                                     └─────────────┘                                  ▼
                                                                               ┌─────────────┐
                                                                               │  Text Node  │
                                                                               │   "Add"     │
                                                                               └─────────────┘

--

2. Danh sách câu lệnh Query Selector đáp ứng các yêu cầu

// 1. Chọn thẻ <h1>
const todoTitle = document.querySelector("#app header h1");
// Hoặc ngắn gọn hơn nếu h1 là duy nhất: document.querySelector("h1");

// 2. Chọn input trong form
const todoInput = document.querySelector("#todoForm #todoInput");
// Hoặc: document.querySelector("#todoForm input");

// 3. Chọn tất cả các phần tử có class là .todo-item (Dùng querySelectorAll để lấy danh sách)
const todoItems = document.querySelectorAll(".todo-item");

// 4. Chọn thẻ liên kết (link) đang có class active
const activeLink = document.querySelector("nav a.active");

// 5. Chọn thẻ <li> đầu tiên nằm bên trong danh sách #todoList
const firstTodoItem = document.querySelector("#todoList li:first-child");
// Hoặc đơn giản: document.querySelector("#todoList li"); (Vì querySelector luôn lấy phần tử đầu tiên thỏa mãn)

// 6. Chọn tất cả các thẻ liên kết <a> nằm trực thuộc bên trong thẻ <nav>
const navLinks = document.querySelectorAll("nav a");