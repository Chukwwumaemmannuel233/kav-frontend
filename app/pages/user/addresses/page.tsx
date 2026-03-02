"use client"

import { useEffect, useState } from "react"
import SiteHeader from "../../../components/site-header"
import { Edit, Trash2, MapPin, X } from "lucide-react"
import { toast } from "sonner"
import API from "@/lib/api";


interface Address {
  id: string
  full_name: string
  phone: string
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  })

  /* ================= FETCH ADDRESSES ================= */
 const fetchAddresses = async () => {
  try {
    const { data } = await API.get("/addresses");
    setAddresses(data.addresses || []);
  } catch (err) {
    toast.error("Failed to load addresses");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAddresses()
  }, [])

  /* ================= ACTIONS ================= */
 const handleSetPrimary = async (id: string) => {
  const toastId = toast.loading("Setting primary address...");

  try {
    await API.put(`/addresses/${id}/default`);
    toast.success("Primary address updated");
    fetchAddresses();
  } catch {
    toast.error("Failed to set primary address");
  } finally {
    toast.dismiss(toastId);
  }
};

  const handleDelete = async (id: string) => {
  const confirmed = confirm("Delete this address?");
  if (!confirmed) return;

  const toastId = toast.loading("Deleting address...");

  try {
    // ✅ Use Axios API instance instead of fetch
    await API.delete(`/addresses/${id}`);

    toast.success("Address deleted");
    fetchAddresses(); // refresh the list
  } catch (err) {
    // Axios errors will be caught here
    toast.error("Failed to delete address");
  } finally {
    toast.dismiss(toastId);
  }
};


  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setForm(address)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingAddress(null)
    setForm({
      full_name: "",
      phone: "",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    })
    setIsDialogOpen(true)
  }

 const handleSubmit = async () => {
  const toastId = toast.loading(
    editingAddress ? "Updating address..." : "Saving address..."
  );

  try {
    const url = editingAddress
      ? `/addresses/${editingAddress.id}`
      : `/addresses`;

    const method = editingAddress ? "put" : "post";

    // ✅ Use Axios instead of fetch
    const res = await API({
      url,
      method,
      data: form, // Axios automatically stringifies JSON
    });

    toast.success(editingAddress ? "Address updated" : "Address added");
    setIsDialogOpen(false);
    fetchAddresses(); // refresh the list
  } catch (err: any) {
    // Axios error already handled by interceptor for 401/403
    toast.error(err.response?.data?.message || "Failed to save address");
  } finally {
    toast.dismiss(toastId);
  }
};


  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#E5DDD5]">
      <SiteHeader variant="user" />

      <main className="max-w-7xl mx-auto px-4 py-10 pb-24">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">Saved Addresses</h1>
            <p className="text-neutral-600 mt-1">
              Manage your delivery addresses
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-black text-white px-6 py-3 rounded-md"
          >
            + Add Address
          </button>
        </div>

        {loading && <p>Loading addresses...</p>}

        {!loading && addresses.length === 0 && (
          <div className="border-2 border-dashed p-12 bg-white text-center rounded-lg">
            <MapPin size={32} className="mx-auto mb-4 text-neutral-600" />
            <p className="text-lg font-medium mb-2">No addresses yet</p>
            <button
              onClick={handleAddNew}
              className="bg-black text-white px-6 py-3 rounded-md"
            >
              Add Address
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold text-lg">{addr.full_name}</h3>
                {addr.is_default && (
                  <span className="text-xs bg-neutral-200 px-2 py-1 rounded">
                    Primary
                  </span>
                )}
              </div>

              <p className="text-neutral-600">{addr.street_address}</p>
              <p className="text-neutral-600">
                {addr.city}, {addr.state} {addr.postal_code}
              </p>
              <p className="text-neutral-600">{addr.country}</p>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                {!addr.is_default ? (
                  <button
                    onClick={() => handleSetPrimary(addr.id)}
                    className="text-sm border px-4 py-2 rounded"
                  >
                    Set as Primary
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(addr)}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(addr.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= MODAL ================= */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingAddress ? "Edit Address" : "Add Address"}
              </h2>
              <button onClick={() => setIsDialogOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(form).map(([key, value]) => (
                <input
                  key={key}
                  placeholder={key.replace("_", " ")}
                  value={value}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
