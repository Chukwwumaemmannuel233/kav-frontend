export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-10 w-64 bg-neutral-200 rounded animate-pulse mb-2" />
            <div className="h-6 w-96 bg-neutral-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="h-7 w-48 bg-neutral-200 rounded animate-pulse mb-6" />
                <div className="space-y-4">
                  <div className="h-10 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-10 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-10 w-40 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
