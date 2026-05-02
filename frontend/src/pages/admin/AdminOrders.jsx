import { privateApi } from "@/api/axios";

import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");
  console.log(orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await privateApi.get(
         "/orders/all",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (data.success) setOrders(data.orders);
        console.log(data.orders);
      } catch (error) {
        console.error("❌ Failed to fetch admin order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]); //why use accessToken? and refresh token functionality is remaining for impliment

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading all orders...
      </div>
    );
  }



  return (
    <div className="py-10 md:py-0  px-4 sm:px-6  max-w-7xl  mt-15 md:mt-20">
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-10   mb-6">
        Admin - All Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <>
          {/* ✅ Desktop Table */}
          <div className="hidden max-h-[80vh]  md:block overflow-x-auto overflow-y-auto ">
            <table className="w-full border border-gray-200 text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Products</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-2 border">{order._id}</td>
                    <td className="px-4 py-2 border">
                      {order.user?.firstName} {order.user?.lastName} <br />
                      <span className="text-xs text-gray-500">
                        {order.user?.email}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      {order.products.map((p, index) => (
                        <div key={index}>
                          {p.productId?.productName} x {p.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-2 border font-semibold">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p className="text-xs text-gray-500 break-all">
                  ID: {order._id}
                </p>

                <p className="font-medium mt-1">
                  {order.user?.firstName} {order.user?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {order.user?.email}
                </p>

                <div className="mt-2 text-sm">
                  {order.products.map((p, index) => (
                    <div key={index}>
                      {p.productId?.productName} x {p.quantity}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="font-semibold">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </span>

                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );


};

export default AdminOrders;
