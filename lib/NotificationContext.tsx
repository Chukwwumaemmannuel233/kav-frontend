"use client";
import { createContext, useContext, useEffect, useState } from "react";
import API from "@/lib/api";
import io from "socket.io-client";

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);

  // fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications);

      const unread = res.data.notifications.filter((n:any)=>!n.is_read).length;
      setNotificationUnreadCount(unread);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // socket realtime
    const socket = io("http://localhost:5000");

    socket.on("new_notification", (data:any) => {
      setNotifications(prev => [data, ...prev]);
      setNotificationUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect(); // ✅ correct cleanup
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationUnreadCount,
        setNotificationUnreadCount,
        fetchNotifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);



