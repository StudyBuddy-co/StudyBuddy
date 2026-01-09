
export function Progress({ value = 0 }) {
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <div
        className="h-full bg-teal-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}