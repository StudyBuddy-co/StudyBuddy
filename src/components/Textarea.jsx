import * as React from "react"

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={
        "resize-none border border-gray-300 placeholder-gray-400 flex min-h-16 w-full rounded-md px-3 py-2 text-base outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 " +
        className
      }
      {...props}
    />
  )
}

export { Textarea }