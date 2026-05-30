// Truy vấn các phần tử Input và điều khiển DOM
const form = document.getElementById('registerForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const phone = document.getElementById('phone');
const submitBtn = document.getElementById('submitBtn');

// Các thanh đo cường độ mật khẩu
const strengthBar = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');

// Cửa sổ Modal
const successModal = document.getElementById('successModal');
const modalSummary = document.getElementById('modalSummary');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Đối tượng quản lý trạng thái hợp lệ của các trường (State Matrix)
const formState = {
    name: false,
    email: false,
    password: false,
    confirm: false,
    phone: false
};

// --- 1. HÀM TRỢ GIÚP ĐỔI CLASS GIAO DIỆN (UI MANIPULATION) ---
function setValid(inputElement, stateKey) {
    const group = inputElement.closest('.form-group');
    group.classList.remove('invalid');
    group.classList.add('valid');
    group.querySelector('.status-icon').textContent = '✅';
    formState[stateKey] = true;
    checkFormValidity();
}

function setInvalid(inputElement, stateKey) {
    const group = inputElement.closest('.form-group');
    group.classList.remove('valid');
    group.classList.add('invalid');
    group.querySelector('.status-icon').textContent = '❌';
    formState[stateKey] = false;
    checkFormValidity();
}

function clearState(inputElement, stateKey) {
    const group = inputElement.closest('.form-group');
    group.classList.remove('valid', 'invalid');
    group.querySelector('.status-icon').textContent = '';
    formState[stateKey] = false;
    checkFormValidity();
}

// Hàm quét trạng thái tổng để bật/tắt nút Submit
function checkFormValidity() {
    const allValid = Object.values(formState).every(state => state === true);
    submitBtn.disabled = !allValid;
}

// --- 2. LOGIC KIỂM ĐỊNH TỪNG TRƯỜNG DỮ LIỆU (VALIDATORS) ---

// A. Validate Họ và Tên (Độ dài từ 2 đến 50 ký tự)
fullName.addEventListener('input', () => {
    const val = fullName.value.trim();
    if (val.length === 0) {
        clearState(fullName, 'name');
    } else if (val.length >= 2 && val.length <= 50) {
        setValid(fullName, 'name');
    } else {
        setInvalid(fullName, 'name');
    }
});

// B. Validate Email bằng biểu thức chính quy (Regex Pattern)
email.addEventListener('input', () => {
    const val = email.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (val.length === 0) {
        clearState(email, 'email');
    } else if (emailRegex.test(val)) {
        setValid(email, 'email');
    } else {
        setInvalid(email, 'email');
    }
});

// C. Xử lý Password Strength Meter (Thước đo mật khẩu)
password.addEventListener('input', () => {
    const val = password.value;
    
    if (val.length === 0) {
        clearState(password, 'password');
        strengthBar.style.width = '0%';
        strengthLabel.textContent = 'Mức độ bảo mật: Chưa nhập';
        // Khi đổi mật khẩu gốc, bắt buộc phải check lại ô xác nhận
        validateConfirmPassword();
        return;
    }

    let score = 0;
    // Quy tắc 1: Có chiều dài lớn hơn hoặc bằng 8 ký tự
    const hasLength = val.length >= 8;
    // Quy tắc 2: Có chứa cả chữ và số
    const hasAlphaNum = /[a-zA-Z]/.test(val) && /[0-9]/.test(val);
    // Quy tắc 3: Đầy đủ chữ hoa, chữ thường, số, ký tự đặc biệt
    const hasFullSpecs = /[a-z]/.test(val) && /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val);

    if (hasLength) {
        if (hasFullSpecs) {
            score = 3; // MẠNH
        } else if (hasAlphaNum) {
            score = 2; // TRUNG BÌNH
        } else {
            score = 1; // YẾU (Có 8 ký tự nhưng chỉ toàn chữ hoặc toàn số)
        }
    } else {
        score = 1; // YẾU (Dưới 8 ký tự)
    }

    // Đổi màu và kéo dài thanh tiến trình (Progress Bar) theo điểm số
    if (score === 1) {
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = 'var(--danger)';
        strengthLabel.textContent = 'Mức độ bảo mật: Yếu (Đỏ)';
        setInvalid(password, 'password'); // Không công nhận mật khẩu yếu là hợp lệ
    } else if (score === 2) {
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = 'var(--warning)';
        strengthLabel.textContent = 'Mức độ bảo mật: Trung bình (Vàng)';
        setValid(password, 'password');
    } else if (score === 3) {
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = 'var(--success)';
        strengthLabel.textContent = 'Mức độ bảo mật: Mạnh (Xanh)';
        setValid(password, 'password');
    }

    validateConfirmPassword();
});

// D. Validate Confirm Password (Khớp thời gian thực)
function validateConfirmPassword() {
    const pVal = password.value;
    const cpVal = confirmPassword.value;

    if (cpVal.length === 0) {
        clearState(confirmPassword, 'confirm');
    } else if (pVal === cpVal && formState.password) {
        setValid(confirmPassword, 'confirm');
    } else {
        setInvalid(confirmPassword, 'confirm');
    }
}
confirmPassword.addEventListener('input', validateConfirmPassword);

// E. Định dạng thông minh Số điện thoại khi gõ: 0901-234-567
phone.addEventListener('input', (e) => {
    // Chỉ lọc lấy các chữ số thô, bóc tách toàn bộ ký tự gạch ngang cũ
    let raw = e.target.value.replace(/\D/g, '');
    
    // Tiến hành chèn dấu gạch ngang theo mô hình độ dài chuỗi ký tự thô
    let formatted = '';
    if (raw.length > 0) {
        formatted = raw.substring(0, 4);
    }
    if (raw.length > 4) {
        formatted += '-' + raw.substring(4, 7);
    }
    if (raw.length > 7) {
        formatted += '-' + raw.substring(7, 10);
    }

    // Gán lại chuỗi đã định dạng đẹp mắt vào ô Input
    e.target.value = formatted;

    // Validate kiểm tra độ dài thực tế của số (Đạt 10 chữ số thô mới hợp lệ)
    if (raw.length === 0) {
        clearState(phone, 'phone');
    } else if (raw.length === 10) {
        setValid(phone, 'phone');
    } else {
        setInvalid(phone, 'phone');
    }
});

// --- 3. XỬ LÝ SỰ KIỆN SUBMIT FORM & POPUP MODAL ---
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Chặn tải lại trang

    // Tạo các phần tử văn bản an toàn để gán vào bảng tóm tắt, tránh XSS
    modalSummary.textContent = ''; // Xóa dữ liệu cũ

    const pName = document.createElement('p');
    pName.innerHTML = `<strong>Họ tên:</strong> ${fullName.value.trim()}`;
    
    const pEmail = document.createElement('p');
    pEmail.innerHTML = `<strong>Email:</strong> ${email.value.trim()}`;
    
    const pPhone = document.createElement('p');
    pPhone.innerHTML = `<strong>Số ĐT:</strong> ${phone.value}`;

    modalSummary.appendChild(pName);
    modalSummary.appendChild(pEmail);
    modalSummary.appendChild(pPhone);

    // Kích hoạt hiển thị Modal bảng Flex
    successModal.style.display = 'flex';
});

// Đóng cửa sổ modal và làm sạch (Reset) toàn bộ Form
modalCloseBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
    form.reset();
    
    // Reset toàn bộ trạng thái biến Logic và thanh Strength bar
    strengthBar.style.width = '0%';
    strengthLabel.textContent = 'Mức độ bảo mật: Chưa nhập';
    
    Object.keys(formState).forEach(key => formState[key] = false);
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('valid', 'invalid');
        group.querySelector('.status-icon').textContent = '';
    });
    checkFormValidity();
});