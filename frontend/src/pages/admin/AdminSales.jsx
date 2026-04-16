import { privateApi } from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  });

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await privateApi.get(
       "/orders/sales",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setStats(res.data); //ahi setStats ma res.data set thay chhe means backend thi je pan data aavshe have e setStats  ma aavi jashe....have stats ma salesByDate: [], aa field hashe j nahi..aakhu state ek new datathi replace thai jay chhe mate niche stats.sales accessible chhe because backend thi sales aave chhe res ma
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen ">

    <div className=" md:ml-[350px] max-w-7xl  py-20 pr-20 mx-auto px-4">
      <div className="p-6 grid gap-6 lg:grid-cols-4">
        {/* stats card */}
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalOrders}
          </CardContent>
        </Card>
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalSales}
          </CardContent>
        </Card>

        {/* sales chart  */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            {/* MUST WATCH FOR CHART IN ONLY 8MIN::  https://www.youtube.com/watch?v=Fu_YFp-9xoQ , ane nicheno responsiceContainer e responsive mate chhe...sav small device mobile hoy to tema pan chart clearly dekhay... */}
            <ResponsiveContainer width="100%" height="100%"> 
              <AreaChart data={stats.sales}>
                {/* aavo data male chhe chart ne 
       [
 { date: "2026-03-01", amount: 1200 },
 { date: "2026-03-02", amount: 800 },
 { date: "2026-03-03", amount: 1500 }
] etale niche have XAxis ma date male chhe e datakey ma nakhi chhe ane "Y axis automatically number detect करता है। hamesha number j le.." Y axis bydefault number lai le karan ke biji field amount chhe to  ena acording like amount vadhare hoy to vadhare gap le  like 10k, 20k 30k jo ochhu hoy to 100, 500, 1000 evu rite em */}

                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {/* <CartesianGrid/>   
     <CartesianGrid strokeDasharray="5 5"/> */}
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#F472B6"
                  fill="#F472B6"
                />
                {/*Area main graph draw kare... datakey="amount" means amount field को graph में use करो... */}
              </AreaChart>

              {/*
      //below is different type of chart from rechart
  
  <LineChart width={400} height={400} data={stats.sales}>
  <XAxis dataKey="date" />
  <YAxis  />
  <Tooltip />
  <CartesianGrid stroke="#f5f5f5" />
  <Line type="monotone" dataKey="amount" stroke="#ff7300" />
</LineChart> */}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};
export default AdminSales;
