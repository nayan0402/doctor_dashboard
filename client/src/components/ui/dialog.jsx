// components/ui/dialog.jsx
import * as React from "react"

const Dialog = ({ children, open, onOpenChange }) => (
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="z-50 bg-background p-6 shadow-lg rounded-lg">
        {children}
      </div>
    </div>
  ) : null
)

const DialogContent = ({ children, className = "", ...props }) => (
  <div
    className={`max-w-lg w-full bg-white p-6 rounded-lg shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
)

const DialogHeader = ({ className = "", ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
    {...props}
  />
)

const DialogTitle = ({ className = "", ...props }) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
)

export { Dialog, DialogContent, DialogHeader, DialogTitle }