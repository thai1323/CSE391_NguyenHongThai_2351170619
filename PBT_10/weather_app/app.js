// Quản lý các thành phần giao diện DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const historyList = document.getElementById('historyList');

const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const successState = document.getElementById('successState');
const errorText = document.getElementById('errorText');

// Các ô đổ dữ liệu thời tiết thành công
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weatherDesc');
const humidity = document.getElementById('humidity');
const windspeed = document.getElementById('windspeed');

// --- 1. QUẢN LÝ BẢNG ÁNH XẠ MÃ THỜI TIẾT (WMO WEATHER CODES) ---
function getWeatherDetails(code) {
    const mapping = {
        0: { desc: "Trời quang mây tạnh", icon: "☀️" },
        1: { desc: "Ít mây, trời trong", icon: "🌤️" },
        2: { desc: "Mây rải rác", icon: "⛅" },
        3: { desc: "Trời nhiều mây", icon: "☁️" },
        45: { desc: "Có sương mù", icon: "🌫️" },
        48: { desc: "Sương mù đóng băng", icon: "🌫️" },
        51: { desc: "Mưa phùn nhẹ", icon: "🌦️" },
        53: { desc: "Mưa phùn vừa", icon: "🌦️" },
        55: { desc: "Mưa phùn mật độ dày", icon: "🌦️" },
        61: { desc: "Mưa rào nhẹ", icon: "🌧️" },
        63: { desc: "Mưa vừa", icon: "🌧️" },
        65: { desc: "Mưa to nặng hạt", icon: "🌧️" },
        71: { desc: "Tuyết rơi nhẹ", icon: "❄️" },
        73: { desc: "Tuyết rơi vừa", icon: "❄️" },
        75: { desc: "Tuyết rơi rất dày", icon: "❄️" },
        80: { desc: "Mưa phùn rải rác", icon: "🌧️" },
        81: { desc: "Mưa rào mạnh", icon: "🌧️" },
        82: { desc: "Mưa bão dữ dội", icon: "⛈️" },
        95: { desc: "Có dông bão nhẹ", icon: "⛈️" },
        96: { desc: "Dông kèm mưa đá", icon: "⛈️" }
    };
    return mapping[code] || { desc: "Thời tiết không xác định", icon: "🌍" };
}

// --- 2. HÀM ĐIỀU KHIỂN CHUYỂN ĐỔI GIAO DIỆN (STATE MANAGEMENT) ---
function switchState(state) {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    successState.classList.add('hidden');

    if (state === 'LOADING') {
        loadingState.classList.remove('hidden');
    } else if (state === 'ERROR') {
        errorState.classList.remove('hidden');
    } else if (state === 'SUCCESS') {
        successState.classList.remove('hidden');
    }
}

// --- 3. LÕI XỬ LÝ TRUY VẤN API CHÍNH (ASYNC/AWAIT FETCH) ---
async function fetchWeather(cityRaw) {
    const city = cityRaw.trim();
    if (!city) return;

    switchState('LOADING');

    // Kiểm tra trạng thái mạng cục bộ trước khi gửi request
    if (!navigator.onLine) {
        showError("Mất kết nối Internet. Vui lòng kiểm tra lại mạng.");
        return;
    }

    try {
        // Bước A: Sử dụng API địa lý (Geocoding) để chuyển tên thành phố thành Tọa độ (Lat, Lon)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) throw new Error("API tìm vị trí gặp sự cố.");
        
        const geoData = await geoResponse.json();

        // Trường hợp không tìm thấy thành phố tương ứng
        if (!geoData.results || geoData.results.length === 0) {
            showError(`Không tìm thấy thành phố "${city}". Vui lòng thử lại.`);
            return;
        }

        // Bóc tách dữ liệu vị trí chuẩn
        const { latitude, longitude, name, country } = geoData.results[0];

        // Bước B: Gọi API Thời tiết với tọa độ thu được kèm theo tham số độ ẩm tương đối
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) throw new Error("API thời tiết gặp sự cố.");

        const weatherData = await weatherResponse.json();
        
        // Bước C: Đổ dữ liệu thành công ra giao diện người dùng
        const currentData = weatherData.current;
        const weatherInfo = getWeatherDetails(currentData.weather_code);

        cityName.textContent = `${name}, ${country}`;
        temperature.textContent = Math.round(currentData.temperature_2m);
        weatherIcon.textContent = weatherInfo.icon;
        weatherDesc.textContent = weatherInfo.desc;
        humidity.textContent = `${currentData.relative_humidity_2m}%`;
        windspeed.textContent = `${currentData.wind_speed_10m} km/h`;

        // Đẩy thành phố vào danh sách lịch sử LocalStorage
        saveHistory(name);
        switchState('SUCCESS');

    } catch (error) {
        console.error(error);
        showError("Lỗi hệ thống hoặc Server quá tải. Vui lòng thử lại sau.");
    }
}

function showError(msg) {
    errorText.textContent = msg;
    switchState('ERROR');
}

// --- 4. HỆ THỐNG QUẢN LÝ LỊCH SỬ TÌM KIẾM (LOCAL STORAGE LOGIC) ---
function saveHistory(cityName) {
    let history = JSON.parse(localStorage.getItem('weather_history')) || [];
    
    // Loại bỏ thành phố nếu đã tồn tại trùng lặp để đẩy lên đầu mảng
    history = history.filter(item => item.toLowerCase() !== cityName.toLowerCase());
    
    // Thêm thành phố mới vào vị trí đầu tiên
    history.unshift(cityName);
    
    // Giới hạn nghiêm ngặt chỉ giữ lại tối đa 5 thành phố gần nhất
    if (history.length > 5) {
        history.pop();
    }
    
    localStorage.setItem('weather_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('weather_history')) || [];
    historyList.textContent = "";

    history.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'history-btn';
        btn.textContent = city;
        
        // Click vào thẻ tag lịch sử sẽ kích hoạt tìm kiếm lại
        btn.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeather(city);
        });
        
        historyList.appendChild(btn);
    });
}

// Lắng nghe sự kiện click nút bấm hoặc bấm Enter trong ô input
searchBtn.addEventListener('click', () => fetchWeather(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather(cityInput.value);
});

// Khởi chạy nạp lịch sử khi người dùng mở trang web
renderHistory();

// Mặc định tự động hiển thị thời tiết Hà Nội khi vừa mở app
fetchWeather("Hanoi");