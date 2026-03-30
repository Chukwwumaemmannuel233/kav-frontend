"use client";

import { useEffect, useState } from "react";
import { Search, MoreVertical, UserX } from "lucide-react";
import API from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  signupDate: string;
  avatar: string;
  is_active: boolean;
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
      const res = await API.get("/admin/users");
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
      cancel: { label: "Cancel", onClick: () => {} },
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
      cancel: { label: "Cancel", onClick: () => {} },
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
          {/* LEFT SIDE */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
              Users
            </h1>

            {/* SEARCH */}
            <div className="mb-6 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg 
                  bg-white dark:bg-neutral-900 text-black dark:text-white
                  placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                  focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-x-auto">
              {/* HEADER */}
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
                    onClick={() => {
                      if (showActionMenu) return;
                      setSelectedUser(user);
                    }}
                    className={`px-4 md:px-6 py-4 cursor-pointer transition hover:bg-neutral-50 dark:hover:bg-neutral-800 ${selectedUser?.id === user.id ? "bg-neutral-50 dark:bg-neutral-800" : ""}`}
                  >
                    {/* MOBILE */}
                    <div className="md:hidden flex justify-between relative">
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {user.email}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {user.signupDate}
                        </p>
                      </div>

                      <div className="relative">
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
                              className="w-full text-left px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm"
                              onClick={() => openUserModal(user)}
                            >
                              View details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center relative">
                      <div className="col-span-3 font-medium text-black dark:text-white">
                        {user.name}
                      </div>
                      <div className="col-span-4 text-neutral-600 dark:text-neutral-400">
                        {user.email}
                      </div>
                      <div className="col-span-3 text-neutral-600 dark:text-neutral-400">
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
                          className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {showActionMenu === user.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50">
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm"
                              onClick={() => openUserModal(user)}
                            >
                              View details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-96 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            {selectedUser && (
              <>
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-auto mb-4 overflow-hidden">
                    <img
                      src={selectedUser.avatar || "/placeholder.svg"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-black dark:text-white">
                    {selectedUser.name}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {selectedUser.email}
                  </p>
                </div>

                {/* ORDER HISTORY */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm uppercase mb-4 text-neutral-600 dark:text-neutral-400">
                    Order History
                  </h3>

                  <div className="space-y-3">
                    {orderHistory[selectedUser.id]?.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              Order {order.id}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {order.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-black dark:text-white">
                              ₦{Number(order.total).toLocaleString()}
                            </p>
                            <span className="text-xs text-green-600 dark:text-green-400">
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
                      className="text-sm text-blue-600 dark:text-blue-400 mt-2"
                    >
                      View full history →
                    </button>
                  )}
                </div>

                {/* ACTION BUTTON */}
                <button
                  onClick={() =>
                    selectedUser.is_active
                      ? deactivateUser(selectedUser.id)
                      : reactivateUser(selectedUser.id)
                  }
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2
                    ${
                      selectedUser.is_active
                        ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400"
                        : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400"
                    }`}
                >
                  <UserX size={18} />
                  {selectedUser.is_active
                    ? "Deactivate User"
                    : "Reactivate User"}
                </button>
              </>
            )}
          </div>

          {/* ================= USER DETAILS MODAL ================= */}
          {showUserModal && modalUser && (
            <div
              className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center px-4"
              onClick={() => setShowUserModal(false)}
            >
              <div
                className="bg-white dark:bg-neutral-900 text-black dark:text-white 
      w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto
      border border-neutral-200 dark:border-neutral-700"
                onClick={(e) => e.stopPropagation()}
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-black dark:text-white">
                    User Details
                  </h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-2xl font-bold hover:text-red-500"
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
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {modalUser.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {modalUser.email}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Joined: {modalUser.signupDate}
                    </p>
                  </div>
                </div>

                {/* ORDER HISTORY */}
                <h3 className="font-semibold mb-3 text-black dark:text-white">
                  Order History
                </h3>

                {orderHistory[modalUser.id]?.length === 0 && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No orders yet
                  </p>
                )}

                <div className="space-y-3">
                  {orderHistory[modalUser.id]?.map((order) => (
                    <div
                      key={order.id}
                      className="border border-neutral-200 dark:border-neutral-700 
            bg-white dark:bg-neutral-800 
            rounded-lg p-4 flex justify-between"
                    >
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {order.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-black dark:text-white">
                          ₦{Number(order.total || 0).toLocaleString()}
                        </p>
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FULL HISTORY MODAL */}
          {showModal && selectedUser && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowModal(false)}
            >
              <div
                className="bg-white dark:bg-neutral-900 text-black dark:text-white w-[500px] max-h-[80vh] overflow-y-auto rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between mb-4">
                  <h2 className="font-bold">Full Order History</h2>
                  <button
                    className="hover:text-red-500"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>

                {orderHistory[selectedUser.id]?.map((order) => (
                  <div
                    key={order.id}
                    className="border-b border-neutral-200 dark:border-neutral-700 py-3 flex justify-between"
                  >
                    <div>
                      <p className="text-black dark:text-white">
                        Order {order.id}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {order.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-black dark:text-white">
                        ₦{Number(order.total).toLocaleString()}
                      </p>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
