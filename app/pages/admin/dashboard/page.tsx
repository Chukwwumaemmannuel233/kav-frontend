"use client";
import { useState, useEffect } from "react";
import { Plus, ArrowRight } from "lucide-react";
import AdminHeader from "../../../components/admin-header";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation"; // ✅ ADD THIS

export default function AdminDashboard() {
  // Sample data for the weekly sales chart
  const weeklyData = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 30 },
    { day: "Wed", value: 55 },
    { day: "Thu", value: 40 },
    { day: "Fri", value: 85 },
    { day: "Sat", value: 50 },
    { day: "Sun", value: 70 },
  ];

  const router = useRouter(); // ✅ INITIALIZE ROUTER
  const [isOrders, setOrders] = useState(false);
  const [isNewProduct, setNewProduct] = useState(false);
  const [isMessages, setMessages] = useState(false);
  const maxValue = Math.max(...weeklyData.map((d) => d.value));

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/pages/admin/login");
  }
}, []);


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
      {/* <AdminHeader /> */}

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
            <p className="text-3xl font-bold">1,204</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Pending Orders</p>
            <p className="text-3xl font-bold">38</p>
          </div>

          {/* Total Sales */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Total Sales</p>
            <p className="text-3xl font-bold">$25k</p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Total Users</p>
            <p className="text-3xl font-bold">852</p>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-sm text-neutral-600 mb-2">Total Products</p>
            <p className="text-3xl font-bold">412</p>
          </div>
        </div>

        {/* Charts and Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Sales Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">Weekly Sales Activity</h2>
              <p className="text-sm text-neutral-600">Last 7 Days</p>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-4 h-64">
              {weeklyData.map((item, index) => (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center gap-3"
                >
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        index === 4 ? "bg-black" : "bg-neutral-300"
                      }`}
                      style={{
                        height: `${(item.value / maxValue) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-neutral-600">{item.day}</span>
                </div>
              ))}
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
