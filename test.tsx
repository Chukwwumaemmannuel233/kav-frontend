// "use client"

// import { useEffect, useState } from "react"
// import SiteHeader from "@/components/site-header"
// import { Edit, Trash2, MapPin, X } from "lucide-react"
// import { toast } from "sonner"
// import API from "@/lib/api"

// /* ================= TYPES ================= */

// interface Address {
//   id: string
//   full_name: string
//   phone: string
//   street_address: string
//   city: string
//   state: string
//   postal_code: string
//   country: string
//   is_default: boolean
// }

// interface AddressForm {
//   full_name: string
//   phone: string
//   street_address: string
//   city: string
//   state: string
//   postal_code: string
//   country: string
// }

// const emptyForm: AddressForm = {
//   full_name: "",
//   phone: "",
//   street_address: "",
//   city: "",
//   state: "",
//   postal_code: "",
//   country: "",
// }

// /* ================= COMPONENT ================= */

// export default function SavedAddressesPage() {
//   const [addresses, setAddresses] = useState<Address[]>([])
//   const [loading, setLoading] = useState(true)

//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingAddress, setEditingAddress] = useState<Address | null>(null)

//   const [form, setForm] = useState<AddressForm>(emptyForm)

//   /* ================= FETCH ================= */

//   const fetchAddresses = async () => {
//     try {
//       const { data } = await API.get("/addresses")
//       setAddresses(data.addresses || [])
//     } catch {
//       toast.error("Failed to load addresses")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAddresses()
//   }, [])

//   /* ================= HELPERS ================= */

//   const fillForm = (address: Address) => {
//     setForm({
//       full_name: address.full_name,
//       phone: address.phone,
//       street_address: address.street_address,
//       city: address.city,
//       state: address.state,
//       postal_code: address.postal_code,
//       country: address.country,
//     })
//   }

//   /* ================= ACTIONS ================= */

//   const handleAddNew = () => {
//     setEditingAddress(null)
//     setForm(emptyForm)
//     setIsDialogOpen(true)
//   }

//   const handleEdit = (address: Address) => {
//     setEditingAddress(address)
//     fillForm(address)
//     setIsDialogOpen(true)
//   }

//   const handleSubmit = async () => {
//     const toastId = toast.loading(
//       editingAddress ? "Updating address..." : "Saving address..."
//     )

//     try {
//       if (editingAddress) {
//         await API.put(`/addresses/${editingAddress.id}`, form)
//         toast.success("Address updated")
//       } else {
//         await API.post("/addresses", form)
//         toast.success("Address added")
//       }

//       setIsDialogOpen(false)
//       setForm(emptyForm)
//       fetchAddresses()
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to save address")
//     } finally {
//       toast.dismiss(toastId)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this address?")) return

//     const toastId = toast.loading("Deleting address...")

//     try {
//       await API.delete(`/addresses/${id}`)
//       toast.success("Address deleted")
//       fetchAddresses()
//     } catch {
//       toast.error("Failed to delete address")
//     } finally {
//       toast.dismiss(toastId)
//     }
//   }

//   const handleSetPrimary = async (id: string) => {
//     const toastId = toast.loading("Setting primary address...")

//     try {
//       await API.put(`/addresses/${id}/default`)
//       toast.success("Primary address updated")
//       fetchAddresses()
//     } catch {
//       toast.error("Failed to set primary address")
//     } finally {
//       toast.dismiss(toastId)
//     }
//   }

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-[#E5DDD5] dark:bg-neutral-900">
//       <SiteHeader variant="user" />

//       <main className="max-w-7xl mx-auto px-4 py-10 pb-24">
//         <div className="flex justify-between items-center mb-10">
//           <div>
//             <h1 className="text-4xl font-bold text-black dark:text-white">
//               Saved Addresses
//             </h1>

//             <p className="text-neutral-600 dark:text-neutral-400 mt-1">
//               Manage your delivery addresses
//             </p>
//           </div>

//           <button
//             onClick={handleAddNew}
//             className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-md"
//           >
//             + Add Address
//           </button>
//         </div>

//         {loading && (
//           <p className="text-neutral-600 dark:text-neutral-400">
//             Loading addresses...
//           </p>
//         )}

//         {!loading && addresses.length === 0 && (
//           <div className="border-2 border-dashed p-12 bg-white dark:bg-neutral-800 text-center rounded-lg">
//             <MapPin size={32} className="mx-auto mb-4" />

//             <p className="text-lg font-medium mb-2 text-black dark:text-white">
//               No addresses yet
//             </p>

//             <button
//               onClick={handleAddNew}
//               className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-md"
//             >
//               Add Address
//             </button>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {addresses.map((addr) => (
//             <div
//               key={addr.id}
//               className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border"
//             >
//               <div className="flex justify-between mb-3">
//                 <h3 className="font-semibold text-lg">{addr.full_name}</h3>

//                 {addr.is_default && (
//                   <span className="text-xs bg-neutral-200 px-2 py-1 rounded">
//                     Primary
//                   </span>
//                 )}
//               </div>

//               <p>{addr.street_address}</p>
//               <p>
//                 {addr.city}, {addr.state} {addr.postal_code}
//               </p>
//               <p>{addr.country}</p>

//               <div className="flex justify-between mt-4 pt-4 border-t">
//                 {!addr.is_default ? (
//                   <button
//                     onClick={() => handleSetPrimary(addr.id)}
//                     className="text-sm border px-4 py-2 rounded"
//                   >
//                     Set as Primary
//                   </button>
//                 ) : (
//                   <div />
//                 )}

//                 <div className="flex gap-3">
//                   <button onClick={() => handleEdit(addr)}>
//                     <Edit size={18} />
//                   </button>

//                   <button onClick={() => handleDelete(addr.id)}>
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* ================= MODAL ================= */}

//       {isDialogOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-full max-w-lg">
//             <div className="flex justify-between mb-4">
//               <h2 className="text-xl font-semibold">
//                 {editingAddress ? "Edit Address" : "Add Address"}
//               </h2>

//               <button onClick={() => setIsDialogOpen(false)}>
//                 <X />
//               </button>
//             </div>

//             <div className="space-y-3">
//               <input
//                 placeholder="Full Name"
//                 value={form.full_name}
//                 onChange={(e) =>
//                   setForm({ ...form, full_name: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />

//               <input
//                 placeholder="Phone"
//                 value={form.phone}
//                 onChange={(e) =>
//                   setForm({ ...form, phone: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />

//               <input
//                 placeholder="Street Address"
//                 value={form.street_address}
//                 onChange={(e) =>
//                   setForm({ ...form, street_address: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />

//               <input
//                 placeholder="City"
//                 value={form.city}
//                 onChange={(e) =>
//                   setForm({ ...form, city: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />

//               <input
//                 placeholder="State"
//                 value={form.state}
//                 onChange={(e) =>
//                   setForm({ ...form, state: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />

//               <input
//                 placeholder="Postal Code"
//                 value={form.postal_code}
//                 onChange={(e) =>
//                   setForm({ ...form, postal_code: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />

//               <input
//                 placeholder="Country"
//                 value={form.country}
//                 onChange={(e) =>
//                   setForm({ ...form, country: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setIsDialogOpen(false)}
//                 className="border px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSubmit}
//                 className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }