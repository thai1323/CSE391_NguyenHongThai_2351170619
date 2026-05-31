const performanceMetric = document.getElementById('performanceMetric');
const refreshAllBtn = document.getElementById('refreshAllBtn');

// Danh sách mảng các hàm khởi tạo cấu hình gọi dữ liệu từ API
const apiEndpoints = [
    // 1. API thời tiết Hà Nội
    () => fetch("https://api.open-meteo.com/v1/forecast?latitude=21.03&longitude=105.85&current_weather=true").then(r => {
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    }),
    
    // 2. API Quốc gia Việt Nam
    () => fetch("https://restcountries.com/v3.1/name/vietnam").then(r => {
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    }),
    
    // 3. API Hình ảnh thú cưng ngẫu nhiên
    () => fetch("https://dog.ceo/api/breeds/image/random").then(r => {
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    })
];

// ==========================================================================
// 1. HÀM HIỂN THỊ TRẠNG THÁI LOADING CHO TỪNG WIDGET
// ==========================================================================
function setWidgetLoading(index) {
    const contentArea = document.querySelector(`#widget-${index} .widget-content`);
    contentArea.innerHTML = `
        <div class="widget-loading-view">
            <div class="spinner-mini"></div>
            <span>Đang nạp luồng dữ liệu...</span>
        </div>
    `;
}

// ==========================================================================
// 2. HÀM ĐỔ DỮ LIỆU THÀNH CÔNG (RENDER WIDGET SUCCESS)
// ==========================================================================
function renderWidget(index, data) {
    const contentArea = document.querySelector(`#widget-${index} .widget-content`);
    let htmlContent = "";

    if (index === 0) {
        // Render thông số Thời tiết
        const current = data.current_weather;
        htmlContent = `
            <div class="data-item"><span class="data-label">Nhiệt độ:</span><span class="data-value">${current.temperature}°C</span></div>
            <div class="data-item"><span class="data-label">Tốc độ gió:</span><span class="data-value">${current.windspeed} km/h</span></div>
            <div class="data-item"><span class="data-label">Mã thời tiết:</span><span class="data-value">WMO ${current.weathercode}</span></div>
        `;
    } else if (index === 1) {
        // Render thông số Quốc gia
        const country = data[0];
        htmlContent = `
            <div class="data-item"><span class="data-label">Tên chính thức:</span><span class="data-value" style="font-size:12px">${country.name.official}</span></div>
            <div class="data-item"><span class="data-label">Thủ đô:</span><span class="data-value">${country.capitals ? country.capitals[0] : country.capital[0]}</span></div>
            <div class="data-item"><span class="data-label">Dân số:</span><span class="data-value">${country.population.toLocaleString('vi-VN')} người</span></div>
        `;
    } else if (index === 2) {
        // Render Hình ảnh thú cưng
        htmlContent = `
            <div class="dog-img-container">
                <img src="${data.message}" alt="Cún cưng">
            </div>
        `;
    }

    contentArea.innerHTML = htmlContent;
}

// ==========================================================================
// 3. HÀM BẮT LỖI CÔ LẬP CHO TỪNG WIDGET (RENDER WIDGET ERROR)
// ==========================================================================
function renderWidgetError(index, errorMessage) {
    const contentArea = document.querySelector(`#widget-${index} .widget-content`);
    contentArea.innerHTML = `
        <div class="widget-error-view">
            <div class="error-badge">⚠️</div>
            <span>Mất liên lạc API. Lý do: ${errorMessage}</span>
        </div>
    `;
}

// ==========================================================================
// 4. LÕI ĐIỀU PHỐI CHẠY SONG SONG TRUNG TÂM (CORE PROMISE.ALLSETTLED)
// ==========================================================================
async function loadDashboard() {
    const startTime = Date.now();
    performanceMetric.textContent = "Đang đồng bộ hóa tất cả các API...";
    performanceMetric.style.color = "var(--text-muted)";

    // Chuyển toàn bộ 3 widgets về trạng thái Loading cùng lúc
    apiEndpoints.forEach((_, index) => setWidgetLoading(index));

    try {
        // Kích hoạt cuộc gọi dữ liệu song song đồng thời (Parallel Execution)
        const results = await Promise.allSettled(apiEndpoints.map(callApi => callApi()));
        
        // Duyệt mảng kết quả trả về để phân phối hiển thị
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                renderWidget(index, result.value);
            } else {
                // Tách biệt bắt lỗi độc lập, widget này chết không ảnh hưởng widget kia
                renderWidgetError(index, result.reason.message);
            }
        });

        // Tính toán và in ra đồng hồ đo hiệu năng
        const duration = Date.now() - startTime;
        performanceMetric.textContent = `⚡ Đồng bộ thành công! Dữ liệu nạp hoàn tất trong: ${duration} ms`;
        performanceMetric.style.color = "var(--success)";

    } catch (criticalGlobalError) {
        console.error("Lỗi chí mạng hệ thống điều hướng:", criticalGlobalError);
        performanceMetric.textContent = "Lỗi nghiêm trọng không thể kích hoạt Dashboard.";
        performanceMetric.style.color = "var(--danger)";
    }
}

// Gắn sự kiện click vào nút làm mới hệ thống
refreshAllBtn.addEventListener('click', loadDashboard);

// Tự động kích hoạt nạp dữ liệu lần đầu khi người dùng vừa mở Dashboard
loadDashboard();