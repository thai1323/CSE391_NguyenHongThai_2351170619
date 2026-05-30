// ==========================================================================
// 1. DATABASE SẢN PHẨM (Khai báo mảng 12 sản phẩm thuộc 4 danh mục lớn)
// ==========================================================================
const products = [
    { id: 1, name: "iPhone 16 Pro Max", price: 34990000, category: "phone", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80", rating: 4.9, inStock: true },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 29990000, category: "phone", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80", rating: 4.7, inStock: true },
    { id: 3, name: "Google Pixel 9 Pro", price: 24500000, category: "phone", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80", rating: 4.6, inStock: false },
    { id: 4, name: "MacBook Pro 14-inch M3", price: 45990000, category: "laptop", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", rating: 4.9, inStock: true },
    { id: 5, name: "Dell XPS 13 Plus", price: 38900000, category: "laptop", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80", rating: 4.4, inStock: true },
    { id: 6, name: "ASUS ROG Zephyrus G14", price: 41990000, category: "laptop", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80", rating: 4.8, inStock: true },
    { id: 7, name: "iPad Pro M4 Ultra Thin", price: 28990000, category: "tablet", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80", rating: 4.8, inStock: true },
    { id: 8, name: "Samsung Galaxy Tab S10+", price: 19990000, category: "tablet", image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=400&q=80", rating: 4.3, inStock: true },
    { id: 9, name: "Sony WH-1000XM5", price: 6990000, category: "audio", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80", rating: 4.7, inStock: true },
    { id: 10, name: "Apple AirPods Max", price: 12490000, category: "audio", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=400&q=80", rating: 4.2, inStock: false },
    { id: 11, name: "Marshall Acton III", price: 7490000, category: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80", rating: 4.6, inStock: true },
    { id: 12, name: "Xiaomi Pad 6 Pro", price: 8290000, category: "tablet", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=400&q=80", rating: 4.5, inStock: true }
];

// ==========================================================================
// 2. BIẾN QUẢN LÝ TRẠNG THÁI TOÀN CỤC (GLOBAL FILTER SYSTEM)
// ==========================================================================
let filteredProducts = [...products];
let searchKeyword = "";
let selectedCategory = "all";
let currentSortRule = "default";
let cartCount = 0;

// Các phần tử DOM sẽ được gán sau khi dựng sườn HTML
let productGridElement;
let cartBadgeElement;

// ==========================================================================
// 3. KHỞI TẠO CẤU TRÚC SHELL HTML BẰNG JAVASCRIPT DOM 100%
// ==========================================================================
function buildAppSkeleton() {
    const body = document.body;

    // A. Dựng Navbar
    const nav = document.createElement("nav");
    nav.className = "navbar";
    const navCont = document.createElement("div");
    navCont.className = "container nav-container";
    
    const logo = document.createElement("a");
    logo.className = "brand";
    logo.href = "#";
    logo.textContent = "TechCatalog";
    
    const navActions = document.createElement("div");
    navActions.className = "nav-actions";
    
    const toggleModeBtn = document.createElement("button");
    toggleModeBtn.className = "btn-toggle-mode";
    toggleModeBtn.textContent = "🌙 Dark Mode";
    toggleModeBtn.addEventListener("click", toggleDarkMode);

    const cartIcon = document.createElement("div");
    cartIcon.className = "cart-icon";
    cartIcon.textContent = "🛒";
    cartBadgeElement = document.createElement("span");
    cartBadgeElement.className = "cart-badge";
    cartBadgeElement.textContent = "0";
    cartIcon.appendChild(cartBadgeElement);

    navActions.appendChild(toggleModeBtn);
    navActions.appendChild(cartIcon);
    navCont.appendChild(logo);
    navCont.appendChild(navActions);
    nav.appendChild(navCont);
    body.appendChild(nav);

    // B. Dựng Vùng chứa chính (Main Container)
    const mainContainer = document.createElement("div");
    mainContainer.className = "container";

    // C. Dựng Thanh công cụ tìm kiếm, lọc, sắp xếp (Toolbar Panel)
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar-panel";

    const searchSortRow = document.createElement("div");
    searchSortRow.className = "search-sort-group";

    const searchInput = document.createElement("input");
    searchInput.className = "search-input";
    searchInput.type = "text";
    searchInput.placeholder = "Tìm sản phẩm theo tên...";
    searchInput.addEventListener("input", (e) => {
        searchKeyword = e.target.value;
        executeFiltering();
    });

    const sortSelect = document.createElement("select");
    sortSelect.className = "sort-select";
    
    const options = [
        { val: "default", text: "Sắp xếp mặc định" },
        { val: "price-asc", text: "Giá tăng dần ↑" },
        { val: "price-desc", text: "Giá giảm dần ↓" },
        { val: "name-az", text: "Tên sản phẩm A-Z" },
        { val: "rating-high", text: "Đánh giá cao nhất ★" }
    ];
    options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.val;
        o.textContent = opt.text;
        sortSelect.appendChild(o);
    });
    sortSelect.addEventListener("change", (e) => {
        currentSortRule = e.target.value;
        sortProducts();
    });

    searchSortRow.appendChild(searchInput);
    searchSortRow.appendChild(sortSelect);

    // Tạo các nút danh mục (Category Buttons)
    const catRow = document.createElement("div");
    catRow.className = "category-group";
    const categories = ["all", "phone", "laptop", "tablet", "audio"];
    
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `category-btn ${cat === "all" ? "active" : ""}`;
        btn.textContent = cat;
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedCategory = cat;
            executeFiltering();
        });
        catRow.appendChild(btn);
    });

    toolbar.appendChild(searchSortRow);
    toolbar.appendChild(catRow);
    mainContainer.appendChild(toolbar);

    // D. Dựng Lưới hiển thị danh sách sản phẩm (Product Grid Container)
    productGridElement = document.createElement("div");
    productGridElement.className = "product-grid";
    mainContainer.appendChild(productGridElement);

    body.appendChild(mainContainer);
}

// ==========================================================================
// 4. CÁC HÀM XỬ LÝ LOGIC LỌC DỮ LIỆU & RENDER (CORE FUNCTIONS)
// ==========================================================================

// Hàm gộp điều phối Lọc theo Tên VÀ Danh mục cùng lúc
function executeFiltering() {
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchKeyword.trim().toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sau khi lọc xong, áp dụng tiếp quy tắc sắp xếp hiện tại
    sortProducts();
}

// Hàm sắp xếp mảng sản phẩm: sortProducts()
function sortProducts() {
    if (currentSortRule === "price-asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSortRule === "price-desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (currentSortRule === "name-az") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (currentSortRule === "rating-high") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    } else {
        // Mặc định: Sắp xếp theo ID ban đầu
        filteredProducts.sort((a, b) => a.id - b.id);
    }
    renderProducts();
}

// Hàm vẽ danh sách sản phẩm ra DOM: renderProducts()
function renderProducts() {
    productGridElement.textContent = ""; // Dọn sạch lưới cũ

    if (filteredProducts.length === 0) {
        const msg = document.createElement("div");
        msg.className = "no-products-msg";
        msg.textContent = "Không tìm thấy sản phẩm nào phù hợp với bộ lọc.";
        productGridElement.appendChild(msg);
        return;
    }

    // Vòng lặp duyệt mảng sinh cấu trúc Card bằng createElement
    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        // Bắt sự kiện click vào Card để mở Modal (Ngoại trừ vùng nút mua hàng)
        card.addEventListener("click", (e) => {
            if (!e.target.classList.contains("btn-add-cart")) {
                openQuickViewModal(product);
            }
        });

        const img = document.createElement("img");
        img.className = "product-img";
        img.src = product.image;
        img.alt = product.name;
        img.loading = "lazy";

        if (!product.inStock) {
            const stockBadge = document.createElement("span");
            stockBadge.className = "badge-stock";
            stockBadge.textContent = "Hết hàng";
            card.appendChild(stockBadge);
        }

        const info = document.createElement("div");
        info.className = "product-info";

        const cat = document.createElement("span");
        cat.className = "product-cat";
        cat.textContent = product.category;

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        const rating = document.createElement("div");
        rating.className = "rating-stars";
        rating.textContent = "★ ".repeat(Math.floor(product.rating)) + ` (${product.rating})`;

        const actionRow = document.createElement("div");
        actionRow.className = "price-action-row";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = product.price.toLocaleString("vi-VN") + "đ";

        const addCartBtn = document.createElement("button");
        addCartBtn.className = "btn-add-cart";
        addCartBtn.textContent = product.inStock ? "Thêm giỏ" : "Tạm hết";
        if (!product.inStock) addCartBtn.disabled = true;
        
        // Tương tác huy hiệu giỏ hàng (Add to cart badge logic)
        addCartBtn.addEventListener("click", () => {
            cartCount++;
            cartBadgeElement.textContent = cartCount;
            // Tạo hiệu ứng nảy nhẹ động bằng CSS cho badge số lượng
            cartBadgeElement.style.transform = "scale(1.3)";
            setTimeout(() => cartBadgeElement.style.transform = "scale(1)", 150);
        });

        actionRow.appendChild(price);
        actionRow.appendChild(addCartBtn);

        info.appendChild(cat);
        info.appendChild(name);
        info.appendChild(rating);
        info.appendChild(actionRow);

        card.appendChild(img);
        card.appendChild(info);

        productGridElement.appendChild(card);
    });
}

// ==========================================================================
// 5. CHỨC NĂNG NÂNG CAO: DYNAMIC POPUP MODAL & DARK MODE
// ==========================================================================

// Hàm tạo và hiển thị Modal Chi tiết Sản phẩm tự động
function openQuickViewModal(product) {
    const body = document.body;

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    // Đóng modal khi bấm vào vùng nền mờ phía ngoài
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) backdrop.remove();
    });

    const box = document.createElement("div");
    box.className = "modal-box";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => backdrop.remove());

    const title = document.createElement("h2");
    title.style.fontWeight = "700";
    title.textContent = product.name;

    const wrapper = document.createElement("div");
    wrapper.className = "modal-content-wrapper";

    const leftImg = document.createElement("img");
    leftImg.className = "modal-left-img";
    leftImg.src = product.image;

    const rightInfo = document.createElement("div");
    rightInfo.className = "modal-right-info";

    const priceText = document.createElement("h3");
    priceText.className = "product-price";
    priceText.style.fontSize = "22px";
    priceText.textContent = product.price.toLocaleString("vi-VN") + "đ";

    const desc = document.createElement("p");
    desc.className = "modal-desc-placeholder";
    desc.textContent = `Sản phẩm thuộc nhóm thiết bị cao cấp ngành hàng ${product.category.toUpperCase()}. Trải nghiệm tính năng vượt trội, chế độ bảo hành 12 tháng chính hãng 1 đổi 1 toàn quốc. Đạt điểm số đánh giá xuất sắc ${product.rating}/5 từ chuyên gia công nghệ toàn cầu.`;

    const status = document.createElement("span");
    status.style.fontSize = "13px";
    status.style.fontWeight = "600";
    status.style.color = product.inStock ? "var(--primary)" : "var(--danger)";
    status.textContent = product.inStock ? "● Tình trạng: Sẵn hàng tại kho" : "● Tình trạng: Hết hàng tạm thời";

    rightInfo.appendChild(priceText);
    rightInfo.appendChild(status);
    rightInfo.appendChild(desc);

    wrapper.appendChild(leftImg);
    wrapper.appendChild(rightInfo);

    box.appendChild(closeBtn);
    box.appendChild(title);
    box.appendChild(wrapper);
    backdrop.appendChild(box);
    body.appendChild(backdrop);
}

// Hàm xử lý hoán đổi giao diện Sáng / Tối (Dark Mode Toggle)
function toggleDarkMode(e) {
    const isDark = document.body.classList.toggle("dark-mode");
    e.target.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// ==========================================================================
// 6. KÍCH HOẠT HỆ THỐNG CHẠY KHI TẢI TRANG
// ==========================================================================
buildAppSkeleton();
renderProducts();