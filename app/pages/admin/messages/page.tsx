"use client"

import { useState, useEffect } from "react"
import { Search, ArrowLeft, Package } from "lucide-react" // 🟢 Package icon for fabric requests
import { useMessage } from "@/lib/MessageContext"
import API from "@/lib/api"
import Link from "next/link"

interface Message {
  id: number
  full_name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function MessagesPage() {
  const { messages, fetchMessages } = useMessage() // 🔥 context
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [loading, setLoading] = useState(true)

  const [fabricRequests, setFabricRequests] = useState<any[]>([])
  const [loadingFabric, setLoadingFabric] = useState(true)

  // ================== LOAD MESSAGES & FABRIC REQUESTS ==================
  useEffect(() => {
    const load = async () => {
      await fetchMessages()
      setLoading(false)
      fetchFabricRequests()
    }
    load()
  }, [])

  const fetchFabricRequests = async () => {
    try {
      setLoadingFabric(true)
      const res = await API.get("/admin/fabric-requests")
      setFabricRequests(res.data)
    } catch (err) {
      console.error("Error fetching fabric requests", err)
    } finally {
      setLoadingFabric(false)
    }
  }

  // ================== FILTER MESSAGES ==================
  const filteredMessages = messages.filter(
    (msg) =>
      msg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ================== HANDLE MESSAGE CLICK ==================
  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message)
    setShowMobileDetail(true)

    if (!message.is_read) {
      try {
        const token = localStorage.getItem("token")

        await fetch(`http://localhost:5000/api/contact/${message.id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        })

        fetchMessages() // refresh context unread count
      } catch (err) {
        console.error("Error marking read:", err)
      }
    }
  }

  const handleBackToList = () => setShowMobileDetail(false)

  // ================== UNREAD COUNTS ==================
  const unreadMessages = messages.filter(m => !m.is_read).length
  const unreadFabric = fabricRequests.filter(f => !f.is_read).length // 🔹 add `is_read` field in backend

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="h-[calc(100vh-4rem)] flex gap-4 p-4 md:p-6 pb-24 md:pb-6">

        {/* LIST */}
        <div className={`${showMobileDetail ? "hidden" : "flex"} md:flex w-full md:w-2/5 bg-white rounded-lg shadow-sm flex-col overflow-hidden`}>

          {/* HEADER */}
          <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Admin Panel</h1>
            </div>

            {/* BUTTONS: FABRIC REQUESTS */}
            <div className="flex gap-4">
              <Link href="/pages/admin/fabric-requests">
                <button className="relative bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700">
                  <Package size={18} />
                  Fabric Requests
                  {unreadFabric > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadFabric}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>

          {/* SEARCH */}
          <div className="p-6 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20}/>
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 rounded-lg"
              />
            </div>
          </div>

          {/* MESSAGE LIST */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-6 text-center">No messages</div>
            ) : (
              filteredMessages.map((message)=>(
                <button
                  key={message.id}
                  onClick={()=>handleMessageClick(message)}
                  className={`w-full p-4 border-b text-left hover:bg-neutral-50 ${
                    selectedMessage?.id === message.id ? "bg-neutral-100" : ""
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <h3 className="font-semibold">{message.full_name}</h3>
                    <span className="text-xs text-neutral-500">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-700">
                    {message.subject || "No subject"}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    {!message.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full"/>}
                    <p className="text-xs text-neutral-500">{message.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className={`${showMobileDetail ? "flex" : "hidden"} md:flex w-full md:w-3/5 bg-white rounded-lg shadow-sm flex-col`}>
          {selectedMessage && (
            <>
              <div className="p-6 border-b">
                <button onClick={handleBackToList} className="md:hidden mb-4 flex items-center gap-2">
                  <ArrowLeft size={18}/> Back
                </button>

                <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                <p className="font-semibold">{selectedMessage.full_name}</p>
                <p className="text-sm text-neutral-600">{selectedMessage.email}</p>
              </div>

              <div className="flex-1 p-6">
                <p className="whitespace-pre-line">{selectedMessage.message}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
