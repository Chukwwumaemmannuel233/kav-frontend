"use client";

import { useEffect, useState } from "react";
import { Search, MoreVertical, RotateCcw, UserX } from "lucide-react";
import API from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  signupDate: string;
  avatar: string;
  is_active: boolean; // ⭐ ADD THIS
}


interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState<Record<string, Order[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUser, setModalUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users"); // now uses baseURL automatically

      if (res.data.success) {
        setUsers(res.data.users);
        setSelectedUser(res.data.users[0] || null);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order history for a user (dummy example, replace with your API)
  const fetchOrderHistory = async (userId: string) => {
    try {
      const res = await API.get(`/admin/users/${userId}`);

      if (res.data.success) {
        setOrderHistory((prev) => ({
          ...prev,
          [userId]: res.data.orders,
        }));
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchOrderHistory(selectedUser.id);
  }, [selectedUser]);

  useEffect(() => {
    const closeMenu = () => setShowActionMenu(null);
    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const openUserModal = (user: User) => {
    setModalUser(user);
    setShowUserModal(true);
    setShowActionMenu(null);

    // fetch full order history
    fetchOrderHistory(user.id);
  };

  const deactivateUser = (userId: string) => {
    toast("Deactivate this user?", {
      description: "They will not be able to login",

      action: {
        label: "Yes",
        onClick: async () => {
          try {
            const res = await API.put(`/admin/users/deactivate/${userId}`);

            if (res.data.success) {
              toast.success("User deactivated");
              fetchUsers();
            }
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error");
          }
        },
      },

      cancel: {
        label: "Cancel",
        onClick: () => {}, // REQUIRED by Sonner
      },
    });
  };

  const reactivateUser = (userId: string) => {
    toast("Reactivate this user?", {
      description: "They will be able to login again",
      action: {
        label: "Yes",
        onClick: async () => {
          try {
            const res = await API.put(`/admin/users/reactivate/${userId}`);

            if (res.data.success) {
              toast.success("User reactivated");
              fetchUsers();
            }
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}, // required by Sonner
      },
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">

      <div className="px-4 md:px-8 lg:px-16 py-8 pb-24 md:pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - User List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold">Users</h1>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Users Table */}
           <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-x-auto">
              {/* Desktop Table Header */}
               <div className="hidden md:block bg-neutral-100 dark:bg-neutral-800 px-6 py-3 border-b border-neutral-200 dark:border-neutral-700">
                <div className="grid grid-cols-12 gap-4 font-semibold text-sm uppercase text-black dark:text-white">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-3">Signup Date</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>
              </div>

             <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`px-4 md:px-6 py-4 cursor-pointer transition hover:bg-neutral-50 dark:hover:bg-neutral-800 ${selectedUser?.id === user.id ? "bg-neutral-50 dark:bg-neutral-800" : ""}`}
                    onClick={() => {
                      if (showActionMenu) return;
                      setSelectedUser(user);
                    }}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden flex justify-between relative">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-black dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {user.email}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {user.signupDate}
                          </div>
                        </div>
                        <div className="relative ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(
                                showActionMenu === user.id ? null : user.id,
                              );
                            }}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
                          >
                            <MoreVertical size={20} />
                          </button>
                          {showActionMenu === user.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50">
                              <button
                                onClick={() => openUserModal(user)}
                                className="w-full text-left px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm"
                              >
                                View details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 font-medium truncate">
                          {user.name}
                        </div>
                        <div
                          className="col-span-4 text-neutral-600 truncate"
                          title={user.email}
                        >
                          {user.email}
                        </div>
                        <div className="col-span-3 text-neutral-600">
                          {user.signupDate}
                        </div>
                        <div className="col-span-2 text-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(
                                showActionMenu === user.id ? null : user.id,
                              );
                            }}
                            className="p-2 hover:bg-neutral-200 rounded-lg transition"
                          >
                            <MoreVertical size={20} />
                          </button>
                          {showActionMenu === user.id && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => openUserModal(user)}
                                className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-sm"
                              >
                                View details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - User Details */}
          <div className="w-full lg:w-96 bg-neutral-100 rounded-lg p-6">
            {selectedUser && (
              <>
                {/* User Profile */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-neutral-300 mx-auto mb-4 overflow-hidden">
                    <img
                      src={selectedUser.avatar || "/placeholder.svg"}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-1">
                    {selectedUser.name}
                  </h2>
                  <p className="text-neutral-600 text-sm">
                    {selectedUser.email}
                  </p>
                </div>

                {/* Order History */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-neutral-700 mb-4">
                    Order History
                  </h3>
                  <div className="space-y-3">
                    {orderHistory[selectedUser.id]?.slice(0, 3).map((order) => (
                      <div key={order.id} className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Order {order.id}</p>
                            <p className="text-xs text-neutral-500">
                              {order.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${Number(order.total).toFixed(2)}
                            </p>
                            <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {orderHistory[selectedUser.id]?.length > 3 && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-sm text-blue-600 mt-2"
                    >
                      View full history →
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {selectedUser && (
                    <button
                      onClick={() =>
                        selectedUser.is_active
                          ? deactivateUser(selectedUser.id)
                          : reactivateUser(selectedUser.id)
                      }
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition
        ${selectedUser.is_active ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                    >
                      <UserX size={18} />
                      {selectedUser.is_active
                        ? "Deactivate User"
                        : "Reactivate User"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ================= USER DETAILS MODAL ================= */}
          {showUserModal && modalUser && (
            <div
              className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
              onClick={() => setShowUserModal(false)}
            >
              <div
                className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">User Details</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* USER INFO */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={modalUser.avatar || "/placeholder.png"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{modalUser.name}</h3>
                    <p className="text-sm text-neutral-500">
                      {modalUser.email}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Joined: {modalUser.signupDate}
                    </p>
                  </div>
                </div>

                {/* ORDER HISTORY */}
                <h3 className="font-semibold mb-3">Order History</h3>

                {orderHistory[modalUser.id]?.length === 0 && (
                  <p className="text-sm text-neutral-500">No orders yet</p>
                )}

                <div className="space-y-3">
                  {orderHistory[modalUser.id]?.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 flex justify-between"
                    >
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-xs text-neutral-500">{order.date}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          ₦{Number(order.total || 0).toLocaleString()}
                        </p>
                        <span className="text-xs text-green-600">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {showModal && selectedUser && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)} // 🔥 click outside closes
          >
            <div
              className="bg-white w-[500px] max-h-[80vh] overflow-y-auto rounded-xl p-6 relative"
              onClick={(e) => e.stopPropagation()} // 🔥 prevent inside click closing
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Full Order History</h2>

                {/* ❌ CLOSE BUTTON */}
                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl font-bold hover:text-red-500"
                >
                  ×
                </button>
              </div>

              {/* ORDERS */}
              {orderHistory[selectedUser.id]?.length === 0 ? (
                <p className="text-gray-500">No orders yet</p>
              ) : (
                orderHistory[selectedUser.id]?.map((order) => (
                  <div
                    key={order.id}
                    className="border-b py-3 flex justify-between"
                  >
                    <div>
                      <p className="font-medium">Order {order.id}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        ${Number(order.total || 0).toFixed(2)}
                      </p>
                      <span className="text-xs text-gray-500">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
