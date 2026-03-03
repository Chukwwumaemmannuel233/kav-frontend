"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export default function PaymentProcessingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate payment processing with progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // Redirect after completion (simulate 5 second processing)
    const redirectTimer = setTimeout(() => {
      // Navigate to success page or order confirmation
      router.push("/pages/user/checkout/success")
    }, 5000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-neutral-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-12 text-center">
        {/* Loading Spinner */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8 text-balance">Processing your payment</h1>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-neutral-200 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-black transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Warning Text */}
        <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-12">
          Please wait a moment. Do not close this window or press the back button.
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-neutral-700 mb-8">
          <Lock size={16} className="text-neutral-700" />
          <span className="text-sm font-medium">Secure Transaction</span>
        </div>

        {/* Branding */}
        <div className="text-neutral-400 text-sm font-medium tracking-wider">FABRIC.CO</div>
      </div>
    </div>
  )
}
