import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg hover:brightness-110",
    secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg",
    accent: "bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg",
    outline: "border border-gray-600 bg-transparent hover:bg-surface text-gray-100 hover:text-white",
    ghost: "hover:bg-surface hover:text-accent-foreground text-gray-300",
    destructive: "bg-error hover:bg-error/90 text-white shadow-md hover:shadow-lg",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 rounded-md px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;