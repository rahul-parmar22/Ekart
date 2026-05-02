import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import UserLogo from "/public/defaultProfilePic.png";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Button onClick={() => navigate(-1)} size="icon">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
      </div>

      {/* EMPTY */}
      {userOrder?.length === 0 ? (
        <p className="text-gray-600 text-lg">No Orders found</p>
      ) : (
        <div className="flex flex-col gap-6">

          {userOrder?.map((order) => (
            <div
              key={order._id}
              className="w-full bg-white shadow-md rounded-xl p-4 sm:p-6 border"
            >

              {/* ORDER TOP */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">

                <p className="text-sm break-all">
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order._id}
                </p>

                <p className="text-sm">
                  <span className="font-semibold">Amount:</span>{" "}
                  {order.currency} {order.amount?.toFixed(2)}
                </p>

              </div>

              {/* USER + STATUS */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">

                <div className="text-sm">
                  <p>
                    <span className="font-medium">User:</span>{" "}
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-gray-500">
                    {order.user?.email}
                  </p>
                </div>

                <span
                  className={`w-fit px-3 py-1 text-xs rounded-full text-white ${
                    order.status === "Paid"
                      ? "bg-green-500"
                      : order.status === "Failed"
                      ? "bg-red-500"
                      : "bg-orange-400"
                  }`}
                >
                  {order.status}
                </span>

              </div>

              {/* PRODUCTS */}
              <div className="flex flex-col gap-3">

                <h3 className="font-semibold text-sm">Products</h3>

                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >

                    {/* IMAGE */}
                    <img
                      onClick={() =>
                        navigate(`/products/${product?.productId?._id}`)
                      }
                      src={
                        product.productId?.productImg?.[0]?.url ||
                        UserLogo
                      }
                      alt="product"
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded cursor-pointer flex-shrink-0"
                    />

                    {/* NAME */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base line-clamp-2">
                        {product.productId?.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {product.quantity}
                      </p>
                    </div>

                    {/* PRICE */}
                    <p className="text-sm font-semibold whitespace-nowrap">
                      ₹{product.productId?.productPrice}
                    </p>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default OrderCard;
