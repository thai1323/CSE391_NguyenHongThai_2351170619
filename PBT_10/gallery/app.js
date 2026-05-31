// Cấu hình tham số phân trang
let currentPage = 1;
const itemsLimit = 20;
let isFetching = false; // Cờ chặn việc gọi trùng lặp nhiều request API cùng lúc

const imageGrid = document.getElementById('imageGrid');
const loadTrigger = document.getElementById('load-trigger');

const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');

// ==========================================================================
// 1. CHỨC NĂNG TẢI DỮ LIỆU TỪ API (FETCH PHOTOS)
// ==========================================================================
async function loadMorePhotos() {
    if (isFetching) return; // Nếu đang chạy dở request trước thì không chạy chồng tiếp
    isFetching = true;

    try {
        // Gọi API Lorem Picsum phân trang chuyên nghiệp
        const apiUrl = `https://picsum.photos/v2/list?page=${currentPage}&limit=${itemsLimit}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error("Không thể tải hình ảnh từ máy chủ");
        
        const photos = await response.json();

        // Nếu API hết ảnh hoàn toàn thì ngừng kích hoạt observer
        if (photos.length === 0) {
            infiniteObserver.unobserve(loadTrigger);
            loadTrigger.innerHTML = "<p style='color: var(--text-muted)'>Đã xem hết bộ sưu tập ảnh!</p>";
            return;
        }

        // Tạo và dựng giao diện cho từng bức ảnh nhận được
        photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'photo-card';

            // Tạo link kích thước thực và link thu nhỏ để tối ưu băng thông di động
            const thumbUrl = `https://picsum.photos/id/${photo.id}/400/300`;
            const fullUrl = `https://picsum.photos/id/${photo.id}/1200/900`;

            card.innerHTML = `
                <div class="img-wrapper">
                    <img data-src="${thumbUrl}" alt="Tác phẩm của ${photo.author}" class="lazy-image">
                </div>
                <div class="photo-info">
                    <h3>📷 ${photo.author}</h3>
                </div>
            `;

            // Bắt sự kiện click chuột để mở hộp thoại Lightbox ảnh lớn
            card.addEventListener('click', () => {
                openLightbox(fullUrl, `Tác phẩm của tác giả: ${photo.author}`);
            });

            imageGrid.appendChild(card);
        });

        // Đăng ký giám sát Lazy loading cho các phần tử hình ảnh mới vừa nạp vào DOM
        registerLazyLoading();

        // Tăng trang số cho lần kích hoạt cuộn tiếp theo
        currentPage++;

    } catch (error) {
        console.error("Lỗi hệ thống:", error.message);
    } finally {
        isFetching = false;
    }
}

// ==========================================================================
// 2. KỸ THUẬT LÀM TRỄ ẢNH (LAZY LOADING IMAGES VIA INTERSECTIONOBSERVER)
// ==========================================================================
let lazyImageObserver;

function registerLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image:not(.observed)');

    if (!lazyImageObserver) {
        lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Nếu ảnh bắt đầu lọt vào tầm nhìn Viewport của người dùng
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Chuyển data-src thành src thật để kích hoạt trình duyệt tải ảnh
                    img.src = img.dataset.src;
                    
                    img.addEventListener('load', () => {
                        img.classList.add('loaded'); // Kích hoạt hiệu ứng fade-in mượt mà ở CSS
                    });

                    // Hủy giám sát phần tử này vì ảnh đã được tải xong xuôi
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: "0px 0px 200px 0px" // Tải trước ảnh khi người dùng cuộn cách nó 200px giúp tăng trải nghiệm mượt mà
        });
    }

    lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
        img.classList.add('observed'); // Đánh dấu để tránh đăng ký trùng lặp ở lần sau
    });
}

// ==========================================================================
// 3. CƠ CHẾ CUỘN VÔ HẠN (INFINITE SCROLL VIA INTERSECTIONOBSERVER)
// ==========================================================================
const infiniteObserver = new IntersectionObserver((entries) => {
    // Khi khối Trigger Element (#load-trigger) lọt vào tầm mắt ở đáy trang
    if (entries[0].isIntersecting && !isFetching) {
        loadMorePhotos();
    }
}, {
    rootMargin: "0px 0px 150px 0px" // Chủ động kích hoạt trước khi chạm hẳn đáy 150px để cuộn liên tục không bị khựng
});

// Tiến hành đưa phần tử kích hoạt vào bộ theo dõi giám sát toàn cục
infiniteObserver.observe(loadTrigger);

// ==========================================================================
// 4. QUẢN LÝ LIGHTBOX MODAL OVERLAY
// ==========================================================================
function openLightbox(url, authorText) {
    lightboxImage.src = url;
    lightboxCaption.textContent = authorText;
    lightboxModal.setAttribute('aria-hidden', 'false');
}

function closeLightboxModal() {
    lightboxModal.setAttribute('aria-hidden', 'true');
    lightboxImage.src = ""; // Xóa nguồn ảnh để giải phóng bộ nhớ RAM trình duyệt
}

closeLightbox.addEventListener('click', closeLightboxModal);
lightboxModal.addEventListener('click', (e) => {
    // Nếu click ra vùng đen bên ngoài khung ảnh thì tự động đóng modal
    if (e.target === lightboxModal) {
        closeLightboxModal();
    }
});

// Hỗ trợ bấm phím Escape để thoát nhanh Lightbox tăng tính thân thiện
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.getAttribute('aria-hidden') === 'false') {
        closeLightboxModal();
    }
});