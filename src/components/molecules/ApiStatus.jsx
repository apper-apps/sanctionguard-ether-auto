import React, { useEffect, useState } from "react";
import sanctionsService from "@/services/api/sanctionsService";
import ApperIcon from "@/components/ApperIcon";
import StatusIndicator from "@/components/atoms/StatusIndicator";

const ApiStatus = () => {
  const [status, setStatus] = useState("unknown");
  const [lastChecked, setLastChecked] = useState(null);
  const [statusDetails, setStatusDetails] = useState(null);

  const checkApiStatus = async () => {
    try {
      const apiStatus = await sanctionsService.checkApiStatus();
      setStatus(apiStatus.isConnected ? "online" : "offline");
      setStatusDetails(apiStatus);
      setLastChecked(new Date());
      
      // Log detailed status for debugging
      console.log('API Status Check:', {
        isConnected: apiStatus.isConnected,
        status: apiStatus.status,
        message: apiStatus.message,
        details: apiStatus.details
      });
      
    } catch (error) {
      console.error('API status check failed:', error);
      setStatus("offline");
      setStatusDetails({ message: error.message, isConnected: false });
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    if (statusDetails?.message) {
      return statusDetails.message;
    }
    
    switch (status) {
      case "online":
        return "API Connected";
      case "offline":
        return "API Offline - Using Cache";
      default:
        return "Checking API Connection...";
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