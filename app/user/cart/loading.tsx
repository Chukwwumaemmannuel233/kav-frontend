export default function CartLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-neutral-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-6 pb-6 border-b border-neutral-200">
                  <div className="w-32 h-32 bg-neutral-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-8 bg-neutral-200 rounded w-1/3 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64 bg-neutral-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
