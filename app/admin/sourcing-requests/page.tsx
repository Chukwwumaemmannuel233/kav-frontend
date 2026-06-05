"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ImageIcon, Loader2, RefreshCw, Search } from "lucide-react";
import API from "@/lib/api";
import { toast } from "sonner";

const statuses = ["pending", "contacted", "sourcing", "completed", "cancelled"] as const;

type SourcingStatus = (typeof statuses)[number];

type SourcingRequest = {
  id: string | number;
  name?: string;
  whatsapp?: string;
  phone?: string;
  note?: string;
  status?: SourcingStatus | string;
  image_url?: string;
  image?: string;
  file_url?: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
};

function unwrapRequests(payload: unknown): SourcingRequest[] {
  if (Array.isArray(payload)) return payload as SourcingRequest[];
  if (payload && typeof payload === "object") {
    const data = payload as { data?: unknown; requests?: unknown; sourcingRequests?: unknown };
    if (Array.isArray(data.requests)) return data.requests as SourcingRequest[];
    if (Array.isArray(data.sourcingRequests)) return data.sourcingRequests as SourcingRequest[];
    if (Array.isArray(data.data)) return data.data as SourcingRequest[];
  }
  return [];
}

function unwrapRequest(payload: unknown): SourcingRequest | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as { data?: unknown; request?: unknown; sourcingRequest?: unknown };
  return (data.request || data.sourcingRequest || data.data || payload) as SourcingRequest;
}

function getImageUrl(item?: SourcingRequest | null) {
  return item?.image_url || item?.image || item?.file_url || "";
}

function getPhone(item: SourcingRequest) {
  return item.whatsapp || item.phone || "No WhatsApp";
}

function formatDate(value?: string) {
  if (!value) return "No date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AdminSourcingRequestsPage() {
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [selected, setSelected] = useState<SourcingRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const unreadCount = useMemo(() => requests.filter((item) => !item.is_read).length, [requests]);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return requests;

    return requests.filter((item) =>
      [item.name, getPhone(item), item.note, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [requests, searchQuery]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/sourcing-requests/admin");
      const nextRequests = unwrapRequests(res.data);
      setRequests(nextRequests);
      if (selected) {
        const updatedSelected = nextRequests.find((item) => String(item.id) === String(selected.id));
        if (updatedSelected) setSelected((current) => ({ ...updatedSelected, ...current }));
      }
    } catch (err) {
      console.error("Failed to load sourcing requests", err);
      toast.error("Failed to load sourcing requests");
    } finally {
      setLoading(false);
    }
  };

  const openRequest = async (item: SourcingRequest) => {
    try {
      setDetailLoading(true);
      setSelected(item);

      const res = await API.get(`/sourcing-requests/admin/${item.id}`);
      const detail = unwrapRequest(res.data);
      if (detail) setSelected(detail);

      if (!item.is_read) {
        await API.put(`/sourcing-requests/admin/${item.id}/read`);
        setRequests((current) =>
          current.map((request) => (String(request.id) === String(item.id) ? { ...request, is_read: true } : request))
        );
        setSelected((current) => (current ? { ...current, is_read: true } : current));
      }
    } catch (err) {
      console.error("Failed to open sourcing request", err);
      toast.error("Failed to load request details");
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (status: SourcingStatus) => {
    if (!selected) return;

    try {
      setStatusLoading(true);
      await API.patch(`/sourcing-requests/admin/${selected.id}/status`, { status });
      setSelected((current) => (current ? { ...current, status } : current));
      setRequests((current) =>
        current.map((request) => (String(request.id) === String(selected.id) ? { ...request, status } : request))
      );
      toast.success("Status updated");
    } catch (err) {
      console.error("Failed to update sourcing request status", err);
      toast.error("Could not update status");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 pb-24 text-black dark:bg-neutral-950 dark:text-white md:pb-8">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">Sourcing Requests</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Review landing page sourcing leads and move each request through the sourcing pipeline.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchRequests}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="grid min-h-[680px] gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 p-4 dark:border-neutral-700">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold">Requests</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{unreadCount} unread</p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-200">
                  {requests.length} total
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search name, WhatsApp, note, or status"
                  className="w-full rounded-lg bg-neutral-100 py-2 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-black/10 dark:bg-neutral-800 dark:focus:ring-white/10"
                />
              </div>
            </div>

            <div className="max-h-[560px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-neutral-500">
                  <Loader2 className="animate-spin" size={18} />
                  Loading requests...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-sm text-neutral-500">No sourcing requests found.</div>
              ) : (
                filteredRequests.map((item) => {
                  const isSelected = selected && String(selected.id) === String(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openRequest(item)}
                      className={`w-full border-b border-neutral-200 p-4 text-left transition last:border-b-0 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 ${
                        isSelected ? "bg-neutral-100 dark:bg-neutral-800" : ""
                      } ${!item.is_read ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-transparent"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{item.name || "No name"}</p>
                          <p className="mt-1 truncate text-sm text-neutral-600 dark:text-neutral-400">{getPhone(item)}</p>
                        </div>
                        <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold capitalize text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                          {item.status || "pending"}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {item.note || "No note added"}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                        <span>{formatDate(item.created_at)}</span>
                        {!item.is_read && <span className="font-bold text-orange-600 dark:text-orange-300">New</span>}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            {!selected ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center p-8 text-center text-neutral-500">
                <ImageIcon size={34} />
                <p className="mt-3 text-sm">Select a sourcing request to view details.</p>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="border-b border-neutral-200 p-4 dark:border-neutral-700 md:p-6">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300 lg:hidden"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(selected.created_at)}</p>
                      <h2 className="mt-2 text-2xl font-bold">{selected.name || "No name"}</h2>
                      <p className="mt-1 text-neutral-600 dark:text-neutral-400">{getPhone(selected)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-200">
                      <CheckCircle2 size={14} />
                      {selected.is_read ? "Read" : "Unread"}
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
                  {detailLoading && (
                    <div className="flex items-center gap-2 rounded-lg bg-neutral-100 p-3 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      <Loader2 className="animate-spin" size={16} />
                      Loading latest details...
                    </div>
                  )}

                  <div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-neutral-500">Note</h3>
                    <p className="min-h-28 whitespace-pre-line rounded-lg bg-neutral-100 p-4 text-sm leading-6 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                      {selected.note || "No note was provided for this sourcing request."}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-neutral-500">Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={statusLoading}
                          onClick={() => updateStatus(status)}
                          className={`rounded-full border px-3 py-2 text-xs font-bold capitalize transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            selected.status === status
                              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                              : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-neutral-500">Reference Image</h3>
                    {getImageUrl(selected) ? (
                      <a href={getImageUrl(selected)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <img src={getImageUrl(selected)} alt="Sourcing reference" className="max-h-[520px] w-full object-contain bg-neutral-100 dark:bg-neutral-800" />
                      </a>
                    ) : (
                      <div className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-500 dark:border-neutral-700">
                        No reference image uploaded.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
