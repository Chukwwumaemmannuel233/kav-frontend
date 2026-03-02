"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function AdminFabricRequests() {
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/admin/fabric-requests");
      console.log(res.data);
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load fabric requests");
    }
  };

  // 🟢 mark as read when clicked
  const openDetails = async (item: any) => {
    setSelected(item);

    if (!item.is_read) {
      try {
        await API.put(`/admin/fabric-requests/${item.id}/read`);
        fetchData();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const unreadCount = data.filter((i) => !i.is_read).length;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Fabric Requests ({unreadCount} unread)
      </h1>

      {/* LIST */}
      <div className="space-y-3">
        {data.map((item: any) => (
          <div
            key={item.id}
            onClick={() => openDetails(item)}
            className={`border p-4 rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between ${
              !item.is_read ? "bg-orange-50" : ""
            }`}
          >
            <div>
              <p className="font-semibold">{item.name || "No name"}</p>
              <p className="text-sm text-gray-600">{item.phone}</p>
              <p className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>

            {!item.is_read && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full h-fit">
                New
              </span>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[95%] max-w-lg rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* CLOSE */}
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">Fabric Request Details</h2>

            <p>
              <b>Name:</b> {selected.name}
            </p>
            <p>
              <b>Phone:</b> {selected.phone}
            </p>
            <p className="mt-3">
              <b>Description:</b>
            </p>
            <p className="bg-gray-100 p-3 rounded">{selected.description}</p>

            {/* IMAGE */}
            {/* FILE PREVIEW */}
            {selected.file_url && (
              <div className="mt-5">
                <p className="font-semibold mb-2">Customer Sample</p>

                {/* AUTO DETECT IMAGE */}
                {selected.file_url.match(/\.(jpeg|jpg|png|webp|gif)$/i) && (
                  <img
                    src={selected.file_url}
                    alt="fabric"
                    className="w-full max-h-[400px] object-cover rounded-lg border"
                  />
                )}

                {/* AUTO DETECT VIDEO */}
                {selected.file_url.match(/\.(mp4|webm|mov|avi)$/i) && (
                  <video controls className="w-full rounded-lg">
                    <source src={selected.file_url} />
                    Your browser does not support video
                  </video>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
