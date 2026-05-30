// --- QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT) ---
let todos = [];
let currentFilter = 'all'; // Có 3 giá trị: 'all', 'active', 'completed'

// Truy vấn sẵn các phần tử DOM quan trọng
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');

// --- HÀM KHỞI TẠO ỨNG DỤNG (INITIALIZATION) ---
function init() {
    // Phục hồi mảng todos từ bộ nhớ LocalStorage
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
    render();
}

// --- HÀM ĐỒNG BỘ LOCALSTORAGE ---
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// --- TIÊU CHUẨN AN TOÀN: TẠO LI PHẦN TỬ BẰNG CREATEELEMENT (CHỐNG XSS) ---
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id; // Gắn ID để dễ truy tìm trong mảng State

    // 1. Tạo ô tròn Checkbox hoàn thành việc
    const checkbox = document.createElement('div');
    checkbox.className = 'todo-checkbox';

    // 2. Tạo khối Text hiển thị nội dung công việc
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text; // Dùng textContent chống lỗ hổng bảo mật XSS tuyệt đối

    // 3. Tạo ô Input ẩn sẵn phục vụ cho tính năng double-click để sửa (Edit)
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = todo.text;

    // 4. Tạo nút xóa dấu X màu đỏ
    const destroyBtn = document.createElement('button');
    destroyBtn.className = 'destroy-btn';
    destroyBtn.textContent = '❌';

    // Lắp ghép các mảnh xương lại thành thẻ LI hoàn chỉnh
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editInput);
    li.appendChild(destroyBtn);

    return li;
}

// --- HÀM RENDER ĐỒNG BỘ GIAO DIỆN HỆ THỐNG ---
function render() {
    // 1. Dọn sạch toàn bộ các thẻ LI cũ trước khi render list mới
    todoList.textContent = '';

    // 2. Lọc mảng todos dựa trên trạng thái bộ lọc đang chọn
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true; // trường hợp 'all'
    });

    // 3. Đổ danh sách đã lọc ra cây DOM thật
    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });

    // 4. Tính toán số lượng công việc chưa hoàn thành (Active items count)
    const activeCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;

    // 5. Ẩn/Hiện nút Clear Completed nếu không có việc nào hoàn thành
    const hasCompleted = todos.some(todo => todo.completed);
    clearCompletedBtn.style.visibility = hasCompleted ? 'visible' : 'hidden';

    // Đồng bộ vào LocalStorage
    saveToLocalStorage();
}

// --- HÀM CHỨC NĂNG: THÊM TODO MỚI ---
todoForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Chặn hành vi tải lại trang mặc định của Form
    
    const text = todoInput.value.trim();
    if (text === '') return; // Không cho phép nhập khoảng trắng trống

    // Khởi tạo một Node Object Todo mới
    const newTodo = {
        id: Date.now().toString(), // Tạo ID duy nhất bằng dấu mốc thời gian
        text: text,
        completed: false
    };

    todos.push(newTodo); // Đẩy vào mảng quản lý
    todoInput.value = ''; // Reset rỗng ô nhập liệu
    render();
} );

// --- 💡 BẮT BUỘC: KỸ THUẬT EVENT DELEGATION (ỦY QUYỀN SỰ KIỆN LÊN THẺ CHA #TODOLIST) ---
todoList.addEventListener('click', function(e) {
    const target = e.target;
    // Tìm thẻ LI tổ tiên gần nhất chứa phần tử vừa được click qua dataset ID
    const li = target.closest('.todo-item');
    if (!li) return;
    const id = li.dataset.id;

    // Kịch bản A: Click vào Checkbox hoặc khối Text chữ -> Đổi trạng thái hoàn thành (Toggle Completed)
    if (target.classList.contains('todo-checkbox') || target.classList.contains('todo-text')) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        render();
    }

    // Kịch bản B: Click trúng nút dấu X màu đỏ -> Thực hiện Xóa phần tử (Delete)
    if (target.classList.contains('destroy-btn')) {
        todos = todos.filter(todo => todo.id !== id);
        render();
    }
});

// --- 💡 CHỨC NĂNG NÂNG CAO: DOUBLE-CLICK ĐỂ EDIT TODO ---
todoList.addEventListener('dblclick', function(e) {
    const target = e.target;
    if (target.classList.contains('todo-text')) {
        const li = target.closest('.todo-item');
        li.classList.add('editing'); // Kích hoạt class định dạng ô Input sửa đổi CSS
        
        const editInput = li.querySelector('.edit-input');
        editInput.focus();
        // Đẩy con trỏ chuột text xuống cuối cùng chuỗi chữ
        const val = editInput.value;
        editInput.value = '';
        editInput.value = val;
    }
});

// Lắng nghe sự kiện bàn phím/mất tiêu điểm để Lưu nội dung chỉnh sửa (Edit Save)
todoList.addEventListener('keydown', function(e) {
    const target = e.target;
    if (!target.classList.contains('edit-input')) return;

    const li = target.closest('.todo-item');
    const id = li.dataset.id;

    if (e.key === 'Enter') {
        const newText = target.value.trim();
        if (newText !== '') {
            todos = todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo);
            li.classList.remove('editing');
            render();
        } else {
            // Nếu người dùng xóa hết chữ -> Hiểu mặc định là xóa luôn todo này
            todos = todos.filter(todo => todo.id !== id);
            render();
        }
    }

    if (e.key === 'Escape') {
        // Hủy bỏ trạng thái sửa, hoàn tác lại nội dung cũ
        target.value = todos.find(todo => todo.id === id).text;
        li.classList.remove('editing');
    }
});

// Xử lý sự kiện mất tiêu điểm chuột ra ngoài (blur) thì tự động lưu lại
todoList.addEventListener('focusout', function(e) {
    const target = e.target;
    if (!target.classList.contains('edit-input')) return;
    
    const li = target.closest('.todo-item');
    if (li.classList.contains('editing')) {
        const id = li.dataset.id;
        const newText = target.value.trim();
        if (newText !== '') {
            todos = todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo);
        }
        li.classList.remove('editing');
        render();
    }
});

// --- CHỨC NĂNG: BỘ LỌC CHUYỂN TRẠNG THÁI ĐĂNG KÝ SỰ KIỆN FILTER ---
filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Xóa trạng thái active của nút cũ, bật active cho nút vừa click
        document.querySelector('.filter-btn.active').classList.remove('active');
        this.classList.add('active');

        currentFilter = this.dataset.filter; // Cập nhật biến cờ trạng thái bộ lọc
        render();
    });
});

// --- CHỨC NĂNG: XÓA SẠCH TOÀN BỘ CÁC TODO ĐÃ HOÀN THÀNH ---
clearCompletedBtn.addEventListener('click', function() {
    todos = todos.filter(todo => !todo.completed); // Giữ lại các việc chưa completed
    render();
});

// Khởi chạy hệ thống ngay khi load file app.js
init();