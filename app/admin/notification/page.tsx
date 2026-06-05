"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useNotification } from "@/lib/NotificationContext";
import { toast } from "sonner";
import { Bell, CheckCheck, Clock, ExternalLink, Loader2, Trash2 } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (notification: Notification) => {
    try {
      if (!notification.is_read) {
        await API.put(`/admin/notifications/${notification.id}/read`);
        setNotificationUnreadCount((prev: number) => (prev > 0 ? prev - 1 : 0));
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id ? { ...item, is_read: true } : item
          )
        );
      }

      if (notification.link) {
        window.location.href = notification.link;
      } else {
        toast.error("No link attached to this notification");
      }
    } catch (err) {
      console.log(err);
      toast.error("Action failed");
    }
  };

  const handleDelete = (event: React.MouseEvent | React.KeyboardEvent, id: number) => {
    event.stopPropagation();

    toast("Delete this notification?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await API.delete(`/admin/notifications/${id}`);
            setNotifications((prev) => prev.filter((notification) => notification.id !== id));
            toast.success("Notification deleted");
          } catch (err) {
            console.log(err);
            toast.error("Delete failed");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.message("Deletion cancelled"),
      },
    });
  };

  const markAllRead = async () => {
    try {
      setMarkingAll(true);
      await API.put("/admin/notifications/read-all");
      setNotificationUnreadCount(0);
      setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })));
      toast.success("All marked as read");
    } catch (err) {
      console.log(err);
      toast.error("Failed to mark notifications as read");
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 pb-24 text-black dark:bg-neutral-950 dark:text-white md:pb-8">
      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 shadow-sm dark:bg-neutral-900 dark:text-neutral-300">
              <Bell size={14} />
              {unreadCount} unread
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Notifications</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Store alerts, order updates, and admin activity in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllRead}
            disabled={markingAll || notifications.length === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {markingAll ? <Loader2 className="animate-spin" size={16} /> : <CheckCheck size={16} />}
            Mark all read
          </button>
        </div>

        <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold">Recent notifications</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Click a notification to open its attached link.
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                {notifications.length} total
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-neutral-500">
              <Loader2 className="animate-spin" size={18} />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center text-neutral-500">
              <Bell size={34} />
              <p className="mt-3 text-sm">No notifications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleClick(notification)}
                  className={`group grid w-full gap-4 px-4 py-4 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-800/70 sm:grid-cols-[auto_1fr_auto] sm:px-6 ${
                    !notification.is_read
                      ? "bg-orange-50/70 dark:bg-orange-900/10"
                      : "bg-white dark:bg-neutral-900"
                  }`}
                >
                  <span
                    className={`mt-1 hidden h-10 w-10 items-center justify-center rounded-full sm:inline-flex ${
                      !notification.is_read
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
                    }`}
                  >
                    <Bell size={18} />
                  </span>

                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-black dark:text-white">
                        {notification.title || "Notification"}
                      </span>
                      {!notification.is_read && (
                        <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                          New
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                      {notification.message}
                    </span>
                    <span className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500">
                      <Clock size={13} />
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </span>

                  <span className="flex items-center gap-2 sm:justify-end">
                    {notification.link && (
                      <span className="hidden rounded-full border border-neutral-200 p-2 text-neutral-500 transition group-hover:border-black group-hover:text-black dark:border-neutral-700 dark:text-neutral-400 dark:group-hover:border-white dark:group-hover:text-white sm:inline-flex">
                        <ExternalLink size={15} />
                      </span>
                    )}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => handleDelete(event, notification.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          handleDelete(event, notification.id);
                        }
                      }}
                      className="inline-flex rounded-full border border-red-100 p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:border-red-900/40 dark:hover:bg-red-950/40"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={15} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
