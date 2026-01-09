import * as React from "react";

const Button = React.forwardRef(
  ({ variant = "default", size = "default", className = "", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";

    const base = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none";

    const variantStyles = {
      default: "bg-teal-500 text-white hover:bg-teal-600",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      ghost: "bg-transparent hover:bg-gray-100",
      link: "text-teal-500 underline hover:text-teal-600",
    };

    const sizeStyles = {
      default: "h-9 px-4",
      sm: "h-8 px-3 text-sm",
      lg: "h-10 px-6 text-lg",
      icon: "h-9 w-9 p-0",
    };

    return (
      <Comp
        ref={ref}
        className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };