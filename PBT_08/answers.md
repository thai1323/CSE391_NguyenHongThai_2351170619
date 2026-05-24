## PHẦN C — SUY LUẬN
### Câu C1 — Refactor Code

const processOrders = orders => 
    orders
        // 1. Lọc đơn hàng đã hoàn thành và có giá trị > 100k
        .filter(({ status, total }) => status === "completed" && total > 100000)
        // 2. Biến đổi dữ liệu, destructuring để lấy thuộc tính và tính discount/finalTotal trực tiếp
        .map(({ id, customer, total }) => ({ id, customer, total, discount: total * 0.1, finalTotal: total * 0.9 }))
        // 3. Sắp xếp mảng kết quả theo finalTotal giảm dần
        .sort((a, b) => b.finalTotal - a.finalTotal);

const mockOrders = [
    { id: 101, customer: "An", total: 150000, status: "completed" },
    { id: 102, customer: "Bình", total: 50000, status: "completed" }, // Loại vì total <= 100k
    { id: 103, customer: "Chi", total: 300000, status: "pending" },   // Loại vì chưa completed
    { id: 104, customer: "Dũng", total: 500000, status: "completed" },
    { id: 105, customer: "Em", total: 200000, status: "completed" }
];

console.log("=== KẾT QUẢ ĐƠN HÀNG SAU KHI REFACTOR ===");
console.log(processOrders(mockOrders));