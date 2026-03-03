export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200 px-6 py-4">
        <div className="h-6 w-64 bg-neutral-200 rounded animate-pulse" />
      </header>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse mb-8" />
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse" />
            <div className="h-12 bg-neutral-200 rounded animate-pulse" />
            <div className="h-12 bg-neutral-200 rounded animate-pulse" />
          </div>
          <div className="h-96 bg-neutral-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
