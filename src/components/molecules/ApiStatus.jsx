import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import StatusIndicator from "@/components/atoms/StatusIndicator";
import sanctionsService from "@/services/api/sanctionsService";

const ApiStatus = () => {
  const [status, setStatus] = useState("unknown");
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

const checkApiStatus = async () => {
    try {
      const apiStatus = await sanctionsService.checkApiStatus();
      setStatus(apiStatus.isConnected ? "online" : "offline");
      setLastChecked(new Date());
    } catch (error) {
      setStatus("offline");
      setLastChecked(new Date());
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "API Connected";
      case "offline":
        return "API Offline";
      default:
        return "Checking...";
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-surface border border-gray-700 rounded-lg">
      <StatusIndicator status={status} size="md" />
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{getStatusText()}</p>
        {lastChecked && (
          <p className="text-xs text-gray-400">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>
      <button
        onClick={checkApiStatus}
        className="p-1 text-gray-400 hover:text-accent transition-colors"
        title="Refresh status"
      >
        <ApperIcon name="RefreshCw" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ApiStatus;