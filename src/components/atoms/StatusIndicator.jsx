import React from "react";
import { cn } from "@/utils/cn";

const StatusIndicator = React.forwardRef(({ 
  className, 
  status = "unknown", 
  size = "sm",
  ...props 
}, ref) => {
  const statusColors = {
    online: "bg-success shadow-success/50",
    offline: "bg-error shadow-error/50",
    warning: "bg-warning shadow-warning/50",
    unknown: "bg-gray-500 shadow-gray-500/50"
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-full shadow-lg animate-pulse",
        statusColors[status],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

StatusIndicator.displayName = "StatusIndicator";

export default StatusIndicator;