// Đoạn 1: Hoisting với var
console.log("--- Đoạn 1 ---");
console.log(x); // Output: undefined
var x = 5;

// Đoạn 2: let và Temporal Dead Zone (TDZ)
console.log("\n--- Đoạn 2 ---");
try {
    console.log(y);
    let y = 10;
} catch (error) {
    console.log("Lỗi đoạn 2:", error.message); 
}

// Đoạn 3: Re-assign hằng số const
console.log("\n--- Đoạn 3 ---");
try {
    const z = 15;
    z = 20;
    console.log(z);
} catch (error) {
    console.log("Lỗi đoạn 3:", error.message);
}

// Đoạn 4: Mutate Array với const
console.log("\n--- Đoạn 4 ---");
const arr = [1, 2, 3];
arr.push(4);
console.log(arr); // Output: [1, 2, 3, 4]

// Đoạn 5: Block Scope của let
console.log("\n--- Đoạn 5 ---");
let a = 1;
{
    let a = 2;
    console.log("Trong block:", a); 
}
console.log("Ngoài block:", a); 