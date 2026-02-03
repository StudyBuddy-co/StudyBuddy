import React from "react";

function Dialog({ open, onClose, children, className = "" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={`bg-white rounded-lg shadow-lg z-50 w-full max-w-lg p-6 relative ${className}`}
      >
        {children}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
        >
          ×
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}

function DialogHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

function DialogTitle({ children, className = "" }) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

function DialogContent({ children, className = "" }) {
  return <div className={`${className}`}>{children}</div>;
}

function DialogFooter({ children, className = "" }) {
  return <div className={`mt-4 flex justify-end space-x-2 ${className}`}>{children}</div>;
}

function DialogTrigger({ children, onClick }) {
  return <div onClick={onClick}>{children}</div>;
}

export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger
};