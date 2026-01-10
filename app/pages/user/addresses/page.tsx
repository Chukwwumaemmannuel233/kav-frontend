"use client"

import { useState } from "react"
import SiteHeader from "../../../components/site-header"
import { Edit, Trash2, MapPin, X } from "lucide-react"

interface Address {
  id: string
  name: string
  phone: number
  street: string
  city: string
  state: string
  zip: string
  country: string
  isPrimary: boolean
}

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "John Doe",
      phone: +2348172846347,
      street: "123 Fabric Lane, Apt 4B",
      city: "Weaverville",
      state: "CA",
      zip: "90210",
      country: "United States",
      isPrimary: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: +12347596940,
      street: "456 Silk Road, Suite 100",
      city: "Spoolsville",
      state: "TX",
      zip: "75001",
      country: "United States",
      isPrimary: false,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const handleSetPrimary = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isPrimary: addr.id === id,
      })),
    )
  }

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id))
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingAddress(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#E5DDD5]">
      <SiteHeader variant="user" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Saved Addresses</h1>
            <p className="text-neutral-600 text-sm md:text-base">
              Manage your shipping and billing addresses for faster checkout.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-black text-white hover:bg-neutral-800 px-6 py-3 rounded-md transition whitespace-nowrap font-medium"
          >
            + Add New Address
          </button>
        </div>

        {/* Addresses Grid */}
        {addresses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{address.name}</h3>
                  {address.isPrimary && (
                    <span className="bg-neutral-200 text-neutral-700 px-3 py-1 rounded-full text-xs font-medium">
                      Primary
                    </span>
                  )}
                </div>

                <div className="text-neutral-600 space-y-1 mb-4">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p>{address.country}</p>
                </div>

                {address.isPrimary && <p className="text-sm text-neutral-500 mb-4">Default shipping address</p>}

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  {!address.isPrimary ? (
                    <button
                      onClick={() => handleSetPrimary(address.id)}
                      className="border border-neutral-300 px-4 py-2 rounded-md hover:bg-neutral-50 transition text-sm font-medium"
                    >
                      Set as Primary
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
                      aria-label="Edit address"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        <div className="border-2 border-dashed border-neutral-400 rounded-lg p-12 text-center bg-white/50">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-neutral-300 rounded-full flex items-center justify-center">
              <MapPin size={32} className="text-neutral-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No addresses saved yet</h3>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            Add a new shipping address to get started with your next order.
          </p>
          <button
            onClick={handleAddNew}
            className="bg-black text-white hover:bg-neutral-800 px-6 py-3 rounded-md transition font-medium"
          >
            + Add Your First Address
          </button>
        </div>
      </main>

      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-semibold">{editingAddress ? "Edit Address" : "Add New Address"}</h2>
                <p className="text-sm text-neutral-600 mt-1">
                  {editingAddress
                    ? "Update your address information below."
                    : "Enter your new address information below."}
                </p>
              </div>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  defaultValue={editingAddress?.name}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="street" className="block text-sm font-medium text-neutral-700">
                 Phone Number
                </label>
                <input
                  id="Phone"
                  type="text"
                  placeholder="+234"
                  defaultValue={editingAddress?.phone}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="street" className="block text-sm font-medium text-neutral-700">
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  placeholder="123 Fabric Lane, Apt 4B"
                  defaultValue={editingAddress?.street}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-neutral-700">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Weaverville"
                    defaultValue={editingAddress?.city}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="block text-sm font-medium text-neutral-700">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    placeholder="CA"
                    defaultValue={editingAddress?.state}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="zip" className="block text-sm font-medium text-neutral-700">
                    ZIP Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    placeholder="90210"
                    defaultValue={editingAddress?.zip}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-sm font-medium text-neutral-700">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="United States"
                    defaultValue={editingAddress?.country}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-neutral-200">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition font-medium"
              >
                {editingAddress ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
