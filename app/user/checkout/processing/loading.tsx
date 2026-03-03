export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-12 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
        </div>
        <div className="h-8 bg-neutral-200 rounded w-3/4 mx-auto mb-8"></div>
        <div className="w-full h-2 bg-neutral-200 rounded-full mb-8"></div>
        <div className="h-4 bg-neutral-200 rounded w-full mx-auto"></div>
      </div>
    </div>
  )
}
