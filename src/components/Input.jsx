import * as React from "react"

function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={
        "border border-gray-300 h-9 w-full rounded-md px-3 py-1 text-base outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 " +
        className
      }
      {...props}
    />
  )
}

export { Input }