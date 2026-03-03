export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="h-16 bg-white border-b" />
      <div className="h-[calc(100vh-4rem)] flex gap-4 p-4 md:p-6">
        <div className="w-full md:w-2/5 bg-white rounded-lg shadow-sm animate-pulse">
          <div className="p-6 border-b">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-4" />
            <div className="h-10 bg-neutral-200 rounded" />
          </div>
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border-b">
                <div className="h-5 bg-neutral-200 rounded w-32 mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
                <div className="h-3 bg-neutral-200 rounded w-40" />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block md:w-3/5 bg-white rounded-lg shadow-sm animate-pulse">
          <div className="p-6 border-b">
            <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4" />
            <div className="h-5 bg-neutral-200 rounded w-48" />
          </div>
          <div className="p-6 space-y-3">
            <div className="h-4 bg-neutral-200 rounded w-full" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}
