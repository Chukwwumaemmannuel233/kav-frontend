"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useNotification } from "@/lib/NotificationContext";
import { toast } from "sonner";

type Notification = {
  id: number;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
};

export default function Notifications() {
  const { setNotificationUnreadCount } = useNotification();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // fetch
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/admin/notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 CLICK NOTIFICATION
  const handleClick = async (n: Notification) => {
    try {
      console.log("CLICKED:", n); // debug

      // mark read
      if (!n.is_read) {
        await API.put(`/admin/notifications/${n.id}/read`);
        setNotificationUnreadCount((prev: number) => (prev > 0 ? prev - 1 : 0));
      }

      // redirect
      if (n.link && n.link !== "") {
        window.location.href = n.link;
      } else {
        toast.error("No link attached to this notification");
      }
    } catch (err) {
      console.log(err);
      toast.error("Action failed");
    }
  };

  // 🔥 DELETE
  const handleDelete = (e: any, id: number) => {
    e.stopPropagation(); // VERY IMPORTANT

    toast("Delete this notification?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await API.delete(`/admin/notifications/${id}`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            toast.success("Notification deleted");
          } catch (err) {
            console.log(err);
            toast.error("Delete failed");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          toast.message("Deletion cancelled");
        },
      },
    });
  };
  // 🔥 MARK ALL READ
  const markAllRead = async () => {
    try {
      await API.put("/admin/notifications/read-all");
      setNotificationUnreadCount(0);

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      toast.success("All marked as read");
    } catch (err) {
      console.log(err);
      toast.error("Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed]">

      <main className="max-w-4xl mx-auto p-6">
        {/* header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold">Notifications</h2>

          {/* desktop */}
          <button
            onClick={markAllRead}
            className="hidden md:block bg-black text-white px-4 py-2 rounded"
          >
            Mark all read
          </button>
        </div>

        {/* mobile button under title */}
        <div className="md:hidden mb-6">
          <button
            onClick={markAllRead}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            Mark all as read
          </button>
        </div>

        {/* list */}
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`p-4 bg-white rounded-xl shadow cursor-pointer hover:shadow-md transition 
              ${!n.is_read ? "border-l-4 border-orange-500" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{n.title}</h3>
                  <p className="text-gray-600">{n.message}</p>
                  <small className="text-gray-400">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>

                {/* delete */}
                <button
                  onClick={(e) => handleDelete(e, n.id)}
                  className="text-red-500 text-lg px-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
