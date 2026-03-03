"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import API from "@/lib/api"; // your axios/fetch wrapper

interface Order {
  id: string;
  email: string;
  total: number;
  status: string;
}


export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 10; // orders per page

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (page: number) => {
    try {
      const res = await API.get(`/orders/admin?page=${page}&limit=${limit}`);
      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalOrders(res.data.totalOrders);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-gray-100 text-gray-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-500 text-white";
    }
  };

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter(
          (order: any) => order.status.toLowerCase() === activeFilter,
        );

  return (
    <div className="min-h-screen bg-white">

      <main className="px-6 md:px-12 lg:px-16 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Orders Management
            </h1>
            <p className="text-neutral-600">
              View, filter, and update customer orders.
            </p>
          </div>
        </div>


        {/* Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              activeFilter === "pending"
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter("processing")}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              activeFilter === "processing"
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setActiveFilter("delivered")}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              activeFilter === "delivered"
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setActiveFilter("shipped")}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              activeFilter === "shipped"
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setActiveFilter("canceled")}
            className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
              activeFilter === "canceled"
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            }`}
          >
            Canceled
          </button>
        </div>

      
        {/* Orders Table */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-x-auto w-full">
          <div className="w-full">
            {/* Desktop header */}
            <div className="hidden md:grid md:grid-cols-5 bg-neutral-100 px-6 py-4 font-semibold text-sm">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-neutral-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="px-6 py-4">
                  {/* MOBILE VIEW */}
                  <div className="md:hidden space-y-3 w-full">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-neutral-500">
                        Order ID
                      </span>
                      <span className="font-semibold">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-neutral-500">
                        Customer
                      </span>
                      <span>{order.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-neutral-500">
                        Amount
                      </span>
                      <span className="font-semibold">
                        ₦{Number(order.total).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-neutral-500">
                        Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-neutral-500">
                        Action
                      </span>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-black font-semibold"
                      >
                        View →
                      </Link>
                    </div>
                  </div>

                  {/* DESKTOP VIEW */}
                  <div className="hidden md:grid md:grid-cols-5 md:items-center">
                    <div className="font-semibold">{order.id}</div>
                    <div>{order.email}</div>
                    <div className="font-semibold">
                      ₦{Number(order.total).toLocaleString()}
                    </div>
                    <div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-black font-semibold"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          {Array.from({ length: Math.ceil(totalOrders / limit) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                page === i + 1
                  ? "bg-black text-white font-medium"
                  : "border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
