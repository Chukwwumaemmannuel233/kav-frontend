export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 lg:px-16 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-200 rounded w-48 mb-6"></div>
          <div className="h-12 bg-neutral-200 rounded w-full mb-6"></div>
          <div className="bg-neutral-100 rounded-lg p-8">
            <div className="space-y-4">
              <div className="h-16 bg-neutral-200 rounded"></div>
              <div className="h-16 bg-neutral-200 rounded"></div>
              <div className="h-16 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




