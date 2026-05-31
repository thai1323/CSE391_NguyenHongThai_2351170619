// --- API LAYER ---
const api = {
    baseURL: "https://jsonplaceholder.typicode.com",

    async getUsers() {
        const response = await fetch(`${this.baseURL}/users`);
        if (!response.ok) throw new Error("Không thể lấy danh sách user");
        return await response.json();
    },

    async createUser(data) {
        const response = await fetch(`${this.baseURL}/users`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json' }
        });
        return await response.json();
    },

    async updateUser(id, data) {
        const response = await fetch(`${this.baseURL}/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json' }
        });
        return await response.json();
    },

    async deleteUser(id) {
        const response = await fetch(`${this.baseURL}/users/${id}`, { method: 'DELETE' });
        return response.ok;
    }
};

// --- UI LAYER ---
const ui = {
    tableBody: document.getElementById('userTableBody'),
    modal: document.getElementById('userModal'),
    form: document.getElementById('userForm'),
    toast: document.getElementById('toast'),

    renderUsers(users) {
        this.tableBody.innerHTML = users.map(user => `
            <tr data-id="${user.id}">
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${user.company?.name || user.companyName}</td>
                <td>
                    <button class="btn-edit" onclick="handleEdit(${user.id})">Sửa</button>
                    <button class="btn-delete" onclick="handleDelete(${user.id})">Xóa</button>
                </td>
            </tr>
        `).join('');
    },

    showLoading() {
        this.tableBody.innerHTML = Array(5).fill(0).map(() => `
            <tr>
                <td><div class="skeleton"></div></td>
                <td><div class="skeleton"></div></td>
                <td><div class="skeleton"></div></td>
                <td><div class="skeleton"></div></td>
            </tr>
        `).join('');
    },

    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.style.backgroundColor = type === 'success' ? 'var(--success)' : 'var(--danger)';
        this.toast.style.display = 'block';
        setTimeout(() => this.toast.style.display = 'none', 3000);
    }
};

// --- STATE MANAGEMENT ---
let allUsers = [];

// Khởi tạo
async function init() {
    try {
        ui.showLoading();
        allUsers = await api.getUsers();
        ui.renderUsers(allUsers);
    } catch (err) {
        ui.showToast(err.message, 'error');
    }
}

// SEARCH: Lọc Client-side
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allUsers.filter(u => 
        u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
    ui.renderUsers(filtered);
});

// CREATE & UPDATE
ui.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('userIdInput').value;
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        company: { name: document.getElementById('userCompany').value }
    };

    try {
        if (id) {
            // Update (Mockup API)
            await api.updateUser(id, userData);
            allUsers = allUsers.map(u => u.id == id ? { ...u, ...userData } : u);
            ui.showToast("Cập nhật thành công");
        } else {
            // Create (Mockup API)
            const newUser = await api.createUser(userData);
            // JSONPlaceholder luôn trả về ID 11 cho user mới, ta tự tạo ID để tránh trùng
            newUser.id = Date.now(); 
            allUsers.unshift(newUser);
            ui.showToast("Thêm mới thành công");
        }
        ui.renderUsers(allUsers);
        closeModal();
    } catch (err) {
        ui.showToast("Thao tác thất bại", 'error');
    }
});

// DELETE
async function handleDelete(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa user này?")) return;
    try {
        await api.deleteUser(id);
        allUsers = allUsers.filter(u => u.id !== id);
        ui.renderUsers(allUsers);
        ui.showToast("Đã xóa user");
    } catch (err) {
        ui.showToast("Không thể xóa", 'error');
    }
}

// Helper: Điền data vào form để Edit
function handleEdit(id) {
    const user = allUsers.find(u => u.id == id);
    document.getElementById('modalTitle').textContent = "Chỉnh sửa User";
    document.getElementById('userIdInput').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userCompany').value = user.company?.name || user.companyName;
    ui.modal.classList.add('active');
}

// Modal controls
document.getElementById('addNewBtn').addEventListener('click', () => {
    ui.form.reset();
    document.getElementById('userIdInput').value = "";
    document.getElementById('modalTitle').textContent = "Thêm User Mới";
    ui.modal.classList.add('active');
});

function closeModal() { ui.modal.classList.remove('active'); }
document.getElementById('closeModal').addEventListener('click', closeModal);

init();