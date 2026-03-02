"use client";

import { createContext, useContext, useEffect, useState } from "react";
import API from "@/lib/api";

interface Message {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface MessageContextType {
  messages: Message[];
  unreadCount: number;
  fetchMessages: () => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/contact");

      if (res.data.success) {
        setMessages(res.data.messages);

        const unread = res.data.messages.filter((m: Message) => !m.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.log("Message fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // 🔥 auto refresh every 5 seconds (realtime feel)
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MessageContext.Provider value={{ messages, unreadCount, fetchMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessage must be inside MessageProvider");
  return ctx;
}
