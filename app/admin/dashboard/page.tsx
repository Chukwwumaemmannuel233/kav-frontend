"use client";
import { useState, useEffect } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { requestFCMToken } from "@/lib/fcm";

export default function AdminDashboard() {
  // Sample data for the weekly sales chart

  const router = useRouter(); // ✅ INITIALIZE ROUTER
  const [isOrders, setOrders] = useState(false);
  const [isNewProduct, setNewProduct] = useState(false);
  const [isMessages, setMessages] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    requestFCMToken().then(async (token) => {
      if (token) {
        // Save token to backend
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/save-fcm-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ fcm_token: token }),
          },
        );
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/pages/admin/login");
      return;
    }

    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");

      if (res.data.success) {
        setStats(res.data.stats);
      }

      const chartRes = await API.get("/admin/charts/weekly-sales");

      if (chartRes.data.success) {
        setChartData(chartRes.data.data);
      }
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  const Orders = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrders(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Redirect after login
    router.push("/pages/admin/orders");
  };
  const AddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewProduct(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Redirect after login
    router.push("/pages/admin/add-product");
  };

  const Messages = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Redirect after login
    router.push("/pages/admin/messages");
  };

  return (
    <div className="min-h-screen bg-neutral-50">

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-neutral-600">
            An overview of your store's performance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Total Orders</p>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Pending Orders</p>
            <p className="text-3xl font-bold">{stats.pendingOrders}</p>
          </div>

          {/* Total Sales */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Total Sales</p>
            <p className="text-3xl font-bold">
              {" "}
              ₦{Number(stats.totalSales).toLocaleString()}
            </p>
          </div>
          {/* ₦ {stats.totalSales} */}
          {/* Total Users */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Active Products</p>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
          </div>
        </div>

        {/* Charts and Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Sales Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-4 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  Revenue Analytics
                </h2>
                <p className="text-sm text-neutral-500">
                  Weekly performance of your store
                </p>
              </div>

              <div className="mt-3 sm:mt-0 text-left sm:text-right">
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <p className="text-xl md:text-2xl font-bold">
                  ₦{Number(stats.totalSales).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="w-full h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 0, left: -10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tickFormatter={(value) => `₦${value / 1000}k`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />

                  <Tooltip
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Bar
                    dataKey="total"
                    radius={[8, 8, 0, 0]}
                    className="fill-black"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>

            <div className="space-y-3">
              {/* Add New Product */}
              <Button
                onClick={AddNewProduct}
                isLoading={isNewProduct}
                loadingText="Redirecting..."
                className="w-full bg-black text-white rounded-lg p-4 flex items-center justify-between hover:bg-neutral-800 transition"
              >
                <span className="font-medium">Add New Product</span>
                <Plus size={20} />
              </Button>

              {/* View Orders */}
              <Button
                onClick={Orders}
                isLoading={isOrders}
                loadingText="Redirecting..."
                className="w-full bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between hover:bg-neutral-50 transition"
              >
                <span className="font-medium">View Orders</span>
                <ArrowRight size={20} />
              </Button>

              {/* View Messages */}
              <Button
                onClick={Messages}
                isLoading={isMessages}
                loadingText="Redirecting..."
                className="w-full bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between hover:bg-neutral-50 transition"
              >
                <span className="font-medium">View Messages</span>
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
