"use client"

import { useState } from "react"
import SiteHeader from "../../components/site-header"
import { CreditCard, Lock } from "lucide-react"

interface PaymentMethod {
  id: string
  type: string
  last4: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
  brand: string
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      last4: "1234",
      expiryMonth: "12",
      expiryYear: "26",
      isDefault: true,
      brand: "mastercard",
    },
    {
      id: "2",
      type: "credit",
      last4: "5678",
      expiryMonth: "08",
      expiryYear: "25",
      isDefault: false,
      brand: "visa",
    },
  ])
  const [showAddModal, setShowAddModal] = useState(false)

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const handleRemove = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id))
  }

  const getCardIcon = (brand: string) => {
    const iconClass = "w-10 h-10 rounded flex items-center justify-center text-white text-xs font-bold"
    if (brand === "visa") {
      return <div className={`${iconClass} bg-blue-600`}>VISA</div>
    }
    if (brand === "mastercard") {
      return <div className={`${iconClass} bg-orange-500`}>MC</div>
    }
    return <CreditCard className="w-10 h-10 text-neutral-400" />
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader variant="user" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 pb-24 md:pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Methods</h1>
          <p className="text-neutral-600 text-lg">
            Manage your saved payment methods for a faster and more secure checkout experience.
          </p>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4 mb-8">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white border border-neutral-200 rounded-lg p-6 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {getCardIcon(method.brand)}
                <div>
                  <p className="font-medium text-lg">•••• •••• •••• {method.last4}</p>
                  <p className="text-neutral-500 text-sm">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {method.isDefault ? (
                  <span className="px-3 py-1 bg-neutral-200 text-neutral-700 text-sm rounded">Default</span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="px-3 py-1 text-neutral-600 hover:text-neutral-900 text-sm transition"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleRemove(method.id)}
                  className="text-neutral-500 hover:text-red-600 transition"
                  aria-label="Remove payment method"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Payment Method Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-neutral-800 transition"
          >
            Add New Payment Method
          </button>
        </div>

        {/* Security Message */}
        <div className="flex items-center justify-center gap-2 text-neutral-600 text-sm">
          <Lock className="w-4 h-4" />
          <p>All transactions are secure and encrypted.</p>
        </div>
      </main>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Payment Method</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setShowAddModal(false)
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nameOnCard" className="block text-sm font-medium mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="nameOnCard"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
