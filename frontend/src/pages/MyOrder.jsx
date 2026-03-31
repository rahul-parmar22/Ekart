import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState(null);
  console.log(userOrder);

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.get(
      `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res.data.success) {
      setUserOrder(res.data.orders);
    }
    console.log(res);
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
<>
<OrderCard userOrder={userOrder} />
</>
  );
};

export default MyOrder;
