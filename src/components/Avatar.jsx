import * as React from "react";

const Avatar = ({ className = "", children, ...props }) => (
  <div className={`relative flex h-10 w-10 overflow-hidden rounded-full ${className}`} {...props}>
    {children}
  </div>
);

const AvatarImage = ({ className = "", src, alt = "", ...props }) => {
  // Only render the <img> if src is truthy
  if (!src) return null;

  return <img className={`h-full w-full object-cover ${className}`} src={src} alt={alt} {...props} />;
};

const AvatarFallback = ({ className = "", children, ...props }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export { Avatar, AvatarImage, AvatarFallback };