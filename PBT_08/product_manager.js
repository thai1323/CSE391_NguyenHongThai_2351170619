const products = [
    { id: 1, name: "iPhone 16", price: 25990000, category: "phone", stock: 15, rating: 4.5 },
    { id: 2, name: "MacBook Pro", price: 45990000, category: "laptop", stock: 8, rating: 4.8 },
    { id: 3, name: "AirPods Pro", price: 6990000, category: "accessory", stock: 50, rating: 4.3 },
    { id: 4, name: "iPad Air", price: 16990000, category: "tablet", stock: 0, rating: 4.6 },
    { id: 5, name: "Samsung S24", price: 22990000, category: "phone", stock: 20, rating: 4.4 },
    { id: 6, name: "Dell XPS 15", price: 35990000, category: "laptop", stock: 5, rating: 4.7 },
    { id: 7, name: "Galaxy Buds", price: 3490000, category: "accessory", stock: 100, rating: 4.1 },
    { id: 8, name: "Xiaomi Pad 6", price: 7990000, category: "tablet", stock: 25, rating: 4.2 },
    { id: 9, name: "Pixel 9", price: 19990000, category: "phone", stock: 12, rating: 4.6 },
    { id: 10, name: "ThinkPad X1", price: 32990000, category: "laptop", stock: 3, rating: 4.5 }
];

// 1. Lọc sản phẩm còn hàng (stock > 0)
function getInStock(products) {
    return products.filter(product => product.stock > 0);
}

// 2. Lọc theo category VÀ khoảng giá [minPrice, maxPrice]
function filterProducts(products, category, minPrice, maxPrice) {
    return products.filter(product => 
        product.category === category && 
        product.price >= minPrice && 
        product.price <= maxPrice
    );
}

// 3. Sắp xếp theo giá tăng dần ("asc") hoặc giảm dần ("desc")
function sortByPrice(products, order = "asc") {
    // Sử dụng cú pháp spread [...products] để clone mảng gốc, tránh làm thay đổi trật tự mảng ban đầu (side effect)
    return [...products].sort((a, b) => {
        return order === "desc" ? b.price - a.price : a.price - b.price;
    });
}

// 4. Tìm sản phẩm rẻ nhất mỗi category
function cheapestByCategory(products) {
    return products.reduce((accumulator, currentProduct) => {
        const cat = currentProduct.category;
        // Nếu danh mục chưa tồn tại trong accumulator HOẶC tìm thấy sản phẩm mới có giá rẻ hơn sản phẩm cũ
        if (!accumulator[cat] || currentProduct.price < accumulator[cat].price) {
            accumulator[cat] = currentProduct;
        }
        return accumulator;
    }, {}); // Khởi tạo accumulator là một object rỗng {}
}

// 5. Tính tổng giá trị toàn bộ kho hàng (Giá máy × Số lượng tồn kho cho từng sản phẩm)
function totalInventoryValue(products) {
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
}

// 6. Tạo mảng mới chỉ chứa các thuộc tính được chọn và định dạng lại giá tiền
function formatProductList(products) {
    return products.map(product => ({
        name: product.name,
        // Chuyển đổi số sang chuỗi hiển thị đơn vị tiền tệ Tiếng Việt
        formattedPrice: product.price.toLocaleString("vi-VN") + "đ"
    }));
}

// 7. Tính điểm rating trung bình của toàn bộ danh sách sản phẩm
function averageRating(products) {
    if (products.length === 0) return 0;
    const totalRating = products.reduce((sum, product) => sum + product.rating, 0);
    // Làm tròn lấy 2 chữ số thập phân
    return Math.round((totalRating / products.length) * 100) / 100;
}

// 8. Tìm danh sách sản phẩm theo từ khóa (Tìm trong thuộc tính 'name', không phân biệt hoa thường)
function searchProducts(products, keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(product => product.name.toLowerCase().includes(lowerKeyword));
}

console.log("=== 1. IN-STOCK PRODUCTS (Bỏ iPad Air vì stock = 0) ===");
console.log(getInStock(products));

console.log("\n=== 2. PHONES 15-25 TRIỆU (Có Samsung S24 & Pixel 9) ===");
console.log(filterProducts(products, "phone", 15000000, 25000000));

console.log("\n=== 3. TOP 3 SẢN PHẨM GIÁ CAO NHẤT (SẮP XẾP GIẢM DẦN) ===");
console.log(sortByPrice(products, "desc").slice(0, 3));

console.log("\n=== 4. CHEAPEST BY CATEGORY ===");
console.log(cheapestByCategory(products));

console.log("\n=== 5. TOTAL INVENTORY VALUE ===");
console.log(totalInventoryValue(products).toLocaleString("vi-VN") + "đ");

console.log("\n=== 6. FORMAT PRODUCT LIST ===");
console.log(formatProductList(products.slice(0, 3))); // In thử 3 phần tử đầu để kiểm tra

console.log("\n=== 7. AVERAGE RATING TOÀN KHO ===");
console.log(averageRating(products) + " ⭐");

console.log("\n=== 8. SEARCH PRODUCTS (Từ khóa: 'pad') ===");
console.log(searchProducts(products, "pad"));