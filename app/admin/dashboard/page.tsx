"use client";
import { useState, useEffect } from "react";
import { Plus, ArrowRight, Search } from "lucide-react";
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
  const [isSourcing, setSourcing] = useState(false);
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
      router.push("/admin/login");
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
    router.push("/admin/orders");
  };
  const AddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewProduct(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Redirect after login
    router.push("/admin/add-product");
  };

  const Messages = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Redirect after login
    router.push("/admin/messages");
  };

  const SourcingRequests = async (e: React.FormEvent) => {
    e.preventDefault();
    setSourcing(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    router.push("/admin/sourcing-requests");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            An overview of your store's performance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Orders", value: stats.totalOrders },
            { label: "Pending Orders", value: stats.pendingOrders },
            {
              label: "Total Sales",
              value: `₦${Number(stats.totalSales).toLocaleString()}`,
            },
            { label: "Total Users", value: stats.totalUsers },
            { label: "Active Products", value: stats.totalProducts },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                {item.label}
              </p>
              <p className="text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Charts + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  Revenue Analytics
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Weekly performance of your store
                </p>
              </div>

              <div className="mt-3 sm:mt-0">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total Revenue
                </p>
                <p className="text-xl md:text-2xl font-bold">
                  ₦{Number(stats.totalSales).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#ccc"
                    className="dark:stroke-neutral-700"
                  />

                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10 }}
                    stroke="currentColor"
                  />

                  <YAxis
                    tickFormatter={(value) => `₦${value / 1000}k`}
                    tick={{ fontSize: 10 }}
                    stroke="currentColor"
                  />

                  <Tooltip
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                    }}
                  />

                  <Bar
                    dataKey="total"
                    radius={[8, 8, 0, 0]}
                    className="fill-black dark:fill-white"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>

            <div className="space-y-3">
              {/* Add Product */}
              <Button
                onClick={AddNewProduct}
                isLoading={isNewProduct}
                loadingText="Redirecting..."
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 flex justify-between"
              >
                Add New Product
                <Plus size={20} />
              </Button>

              {/* Orders */}
              <Button
                onClick={Orders}
                isLoading={isOrders}
                loadingText="Redirecting..."
                className="
                    w-full 
                    bg-neutral-100 text-neutral-900 
                    dark:bg-neutral-800 dark:text-neutral-100
                    border border-neutral-200 dark:border-neutral-700
                    hover:bg-neutral-200 dark:hover:bg-neutral-700
                    flex justify-between items-center
                    transition
                  "
              >
                <span className="font-medium">View Orders</span>
                <ArrowRight size={20} />
              </Button>

              {/* Messages */}
              <Button
                onClick={Messages}
                isLoading={isMessages}
                loadingText="Redirecting..."
                className="
                    w-full 
                    bg-neutral-100 text-neutral-900 
                    dark:bg-neutral-800 dark:text-neutral-100
                    border border-neutral-200 dark:border-neutral-700
                    hover:bg-neutral-200 dark:hover:bg-neutral-700
                    flex justify-between items-center
                    transition
                  "
              >
                <span className="font-medium">View Messages</span>
                <ArrowRight size={20} />
              </Button>

              <Button
                onClick={SourcingRequests}
                isLoading={isSourcing}
                loadingText="Redirecting..."
                className="
                    w-full 
                    bg-neutral-100 text-neutral-900 
                    dark:bg-neutral-800 dark:text-neutral-100
                    border border-neutral-200 dark:border-neutral-700
                    hover:bg-neutral-200 dark:hover:bg-neutral-700
                    flex justify-between items-center
                    transition
                  "
              >
                <span className="font-medium">Sourcing Requests</span>
                <Search size={20} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
