import React from "react";

const Verify = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-green-500 mb-4">
            ✅Check Your Email
          </h2>
          <p className="text-gray-400 text-sm">
            We'have sent you an email to verify your account. Please check your
            inbox and click the verification link
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;

// redux for this project

// src/
//  ├── app/
//  │     store.js
//  │
//  ├── features/
//  │     auth/
//  │         authSlice.js
//  │     products/
//  │         productSlice.js
//  │     cart/
//  │         cartSlice.js
//  │     order/
//  │         orderSlice.js

//  📦 Tumhare E-commerce Project Me Redux Kahan Use Hoga?
// 1️⃣ Auth Slice

// Login

// Register

// Logout

// Email verification status

// 2️⃣ Cart Slice

// Add to cart

// Remove

// Update quantity

// Clear cart

// 3️⃣ Product Slice

// Fetch products

// Pagination data

// Search results

// Filters

// 4️⃣ Order Slice

// Place order

// Order history

// Payment status

// 🔥 Normalized State Kya Hota Hai?

// Galat way ❌:

// products: [ {full product object}, {full product object} ]

// Better way ✅:

// products: {
//   byId: {
//     "1": {id:1, name:"Shoes"},
//     "2": {id:2, name:"Watch"}
//   },
//   allIds: ["1", "2"]
// }

// 👉 Ye scalable hota hai
// 👉 Fast lookup
// 👉 Re-renders kam

// Redux Toolkit me createEntityAdapter() se easily hota hai.
