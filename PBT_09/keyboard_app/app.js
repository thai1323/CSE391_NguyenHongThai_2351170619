// ==========================================================================
// 1. DATABASE HÌNH ẢNH & DANH SÁCH LỆNH (COMMAND LIST)
// ==========================================================================
const galleryImages = [
    { id: 1, title: "Không gian làm việc tương lai", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Linh kiện vi xử lý bán dẫn", url: "https://images.unsplash.com/photo-1517055720412-a9c27417e98e?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Hệ thống AI đám mây", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Phòng máy chủ siêu cấp", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Bàn phím cơ Cyberpunk", url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Màn hình mã hóa Code chuyên sâu", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" }
];

const commands = [
    { id: "next", name: "Chuyển đến ảnh kế tiếp (Next Image)", action: () => changeSlide(currentIndex + 1) },
    { id: "prev", name: "Quay lại ảnh phía trước (Previous Image)", action: () => changeSlide(currentIndex - 1) },
    { id: "play", name: "Bật/Tắt chế độ tự động chạy (Toggle Slideshow)", action: () => toggleSlideshow() },
    { id: "dark", name: "Hoán đổi giao diện Sáng / Tối (Toggle Dark Mode)", action: () => document.body.classList.toggle("dark-mode") },
    { id: "reset", name: "Nhảy về tấm ảnh số 1 mặc định", action: () => changeSlide(0) }
];

// Biến trạng thái hệ thống
let currentIndex = 0;
let slideshowInterval = null;
let activeCmdIndex = -1;
let previouslyFocusedElement = null; // Dùng để ghi nhớ trạng thái Focus Trap

// Cấu trúc DOM Elements
const mainImage = document.getElementById("mainImage");
const slideshowStatus = document.getElementById("slideshowStatus");
const thumbGrid = document.getElementById("thumbGrid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playBtn = document.getElementById("playBtn");

const cmdPalette = document.getElementById("cmdPalette");
const cmdInput = document.getElementById("cmdInput");
const cmdList = document.getElementById("cmdList");

// ==========================================================================
// 2. TẠO THUMBNAILS VÀ RENDER GALLERY ỔN ĐỊNH A11Y
// ==========================================================================
function initGallery() {
    thumbGrid.textContent = "";
    
    galleryImages.forEach((img, index) => {
        const btn = document.createElement("button");
        btn.className = "thumb-item";
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", index === currentIndex ? "true" : "false");
        btn.setAttribute("aria-label", `Xem ảnh số ${index + 1}: ${img.title}`);
        
        const thumbnail = document.createElement("img");
        thumbnail.src = img.url;
        thumbnail.alt = img.title;
        
        btn.appendChild(thumbnail);
        
        btn.addEventListener("click", () => {
            stopSlideshow();
            changeSlide(index);
        });
        
        thumbGrid.appendChild(btn);
    });

    changeSlide(0);
}

function changeSlide(index) {
    // Thuật toán vòng tròn chỉ mục
    if (index >= galleryImages.length) index = 0;
    if (index < 0) index = galleryImages.length - 1;

    currentIndex = index;
    const currentData = galleryImages[currentIndex];

    // Cập nhật ảnh lớn kèm hiệu ứng mượt mà
    mainImage.classList.remove("active-slide");
    // Ép trình duyệt chạy reflow để nhận hiệu ứng mượt
    void mainImage.offsetWidth; 
    mainImage.src = currentData.url;
    mainImage.alt = currentData.title;
    mainImage.classList.add("active-slide");

    // Đồng bộ trạng thái viền chọn Thumbnail
    const thumbs = thumbGrid.querySelectorAll(".thumb-item");
    thumbs.forEach((thumb, idx) => {
        if (idx === currentIndex) {
            thumb.classList.add("selected");
            thumb.setAttribute("aria-selected", "true");
        } else {
            thumb.classList.remove("selected");
            thumb.setAttribute("aria-selected", "false");
        }
    });
}

// ==========================================================================
// 3. LOGIC ĐIỀU KHIỂN SLIDESHOW TỰ ĐỘNG (SPACE KEY)
// ==========================================================================
function toggleSlideshow() {
    if (slideshowInterval) {
        stopSlideshow();
    } else {
        playBtn.textContent = "⏸ Tạm dừng";
        slideshowStatus.textContent = "Slideshow: Đang chạy";
        slideshowStatus.style.backgroundColor = "var(--primary)";
        slideshowInterval = setInterval(() => {
            changeSlide(currentIndex + 1);
        }, 2500);
    }
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        playBtn.textContent = "▶ Phát";
        slideshowStatus.textContent = "Slideshow: Tắt";
        slideshowStatus.style.backgroundColor = "rgba(15, 23, 42, 0.8)";
    }
}

// Bắt sự kiện click chuột thủ công
prevBtn.addEventListener("click", () => { stopSlideshow(); changeSlide(currentIndex - 1); });
nextBtn.addEventListener("click", () => { stopSlideshow(); changeSlide(currentIndex + 1); });
playBtn.addEventListener("click", toggleSlideshow);

// ==========================================================================
// 4. HỆ THỐNG PHÍM TẮT TOÀN CỤC (GLOBAL KEYBOARD ACCESSIBILITY)
// ==========================================================================
window.addEventListener("keydown", function(e) {
    const isOverlayOpen = cmdPalette.getAttribute("aria-hidden") === "false";

    // Phím tắt mở bảng điều khiển: Ctrl + K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOverlayOpen) closeCommandPalette(); else openCommandPalette();
        return;
    }

    // Nếu bảng Lệnh đang mở, nhường quyền điều khiển cho hàm xử lý của Palette
    if (isOverlayOpen) {
        handlePaletteKeydown(e);
        return;
    }

    // Tránh ăn phím tắt khi người dùng đang tập trung gõ văn bản ở chỗ khác (nếu có)
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    // A. Mũi tên TRÁI / PHẢI để duyệt ảnh nhanh
    if (e.key === "ArrowRight") {
        e.preventDefault();
        stopSlideshow();
        changeSlide(currentIndex + 1);
    }
    if (e.key === "ArrowLeft") {
        e.preventDefault();
        stopSlideshow();
        changeSlide(currentIndex - 1);
    }

    // B. Phím số từ 1 đến 6 để nhảy cóc đến ảnh tương ứng
    if (e.key >= "1" && e.key <= "6") {
        const targetIndex = parseInt(e.key, 10) - 1;
        stopSlideshow();
        changeSlide(targetIndex);
    }

    // C. Phím cách SPACE để Play/Pause slideshow
    if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault(); // Chặn hành vi trượt trang mặc định của phím Space
        toggleSlideshow();
    }
});

// ==========================================================================
// 5. CƠ CHẾ ĐIỀU KHIỂN COMMAND PALETTE & FOCUS TRAP
// ==========================================================================
function openCommandPalette() {
    previouslyFocusedElement = document.activeElement; // Ghi nhớ vị trí focus cũ
    stopSlideshow();

    cmdPalette.setAttribute("aria-hidden", "false");
    cmdInput.value = "";
    activeCmdIndex = -1;
    filterCommands();
    
    // Đẩy focus lập tức vào ô input tìm kiếm lệnh
    setTimeout(() => cmdInput.focus(), 50);
}

function closeCommandPalette() {
    cmdPalette.setAttribute("aria-hidden", "true");
    // Trả lại tiêu điểm Focus cho phần tử cũ trước khi mở bảng lệnh để tránh đứt đoạn Tab
    if (previouslyFocusedElement) previouslyFocusedElement.focus();
}

function filterCommands() {
    const query = cmdInput.value.toLowerCase().trim();
    cmdList.textContent = "";

    const filtered = commands.filter(cmd => cmd.name.toLowerCase().includes(query));

    if (filtered.length === 0) {
        const noResult = document.createElement("li");
        noResult.className = "cmd-item";
        noResult.style.color = "var(--text-muted)";
        noResult.textContent = "Không tìm thấy lệnh nào khớp...";
        cmdList.appendChild(noResult);
        activeCmdIndex = -1;
        return;
    }

    filtered.forEach((cmd, idx) => {
        const li = document.createElement("li");
        li.className = "cmd-item";
        li.textContent = cmd.name;
        li.dataset.id = cmd.id;
        
        // Thêm gợi ý phím tắt nhỏ ở bên phải dòng lệnh
        const hint = document.createElement("span");
        hint.className = "cmd-shortcut-hint";
        hint.textContent = "Action";
        li.appendChild(hint);

        li.addEventListener("click", () => {
            cmd.action();
            closeCommandPalette();
        });

        cmdList.appendChild(li);
    });

    activeCmdIndex = -1;
}

// Theo dõi người dùng gõ từ khóa tìm kiếm lệnh
cmdInput.addEventListener("input", filterCommands);

// Quản lý cụm phím điều hướng bên trong bảng lệnh (Palette Navigation Keyboard)
function handlePaletteKeydown(e) {
    const items = cmdList.querySelectorAll(".cmd-item:not([style*='color'])");
    
    if (e.key === "Escape") {
        e.preventDefault();
        closeCommandPalette();
        return;
    }

    if (items.length === 0) return;

    // Phím Mũi tên xuống (ArrowDown)
    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (activeCmdIndex < items.length - 1) {
            activeCmdIndex++;
            updateFocusedCommand(items);
        }
    }

    // Phím Mũi tên lên (ArrowUp)
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (activeCmdIndex > 0) {
            activeCmdIndex--;
            updateFocusedCommand(items);
        }
    }

    // Phím Enter để kích hoạt thực thi lệnh
    if (e.key === "Enter") {
        e.preventDefault();
        if (activeCmdIndex >= 0 && items[activeCmdIndex]) {
            const cmdId = items[activeCmdIndex].dataset.id;
            const targetCmd = commands.find(c => c.id === cmdId);
            if (targetCmd) {
                targetCmd.action();
                closeCommandPalette();
            }
        }
    }

    // --- CƠ CHẾ FOCUS TRAP: Khóa chặt phím TAB không cho văng ra ngoài Modal ---
    if (e.key === "Tab") {
        e.preventDefault(); // Giữ chân tiêu điểm chỉ tập trung trong ô Input tìm kiếm
        cmdInput.focus();
    }
}

function updateFocusedCommand(items) {
    items.forEach(item => item.classList.remove("focused"));
    if (items[activeCmdIndex]) {
        const targetItem = items[activeCmdIndex];
        targetItem.classList.add("focused");
        // Cuộn danh sách mượt mà nếu danh mục lệnh bị dài khuất tầm mắt
        targetItem.scrollIntoView({ block: "nearest" });
    }
}

// Khởi chạy hệ thống ứng dụng Gallery khi nạp trang xong
initGallery();