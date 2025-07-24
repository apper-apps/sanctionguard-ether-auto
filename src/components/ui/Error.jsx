import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message, onRetry }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-error to-error/80 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">Search Failed</h3>
      <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
        {message || "Unable to complete the sanctions search. Please check your connection and try again."}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onRetry}
          className="bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button variant="outline">
          <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>

      <div className="mt-8 p-4 bg-surface border border-gray-700 rounded-lg max-w-md">
        <div className="flex items-start gap-3">
          <ApperIcon name="Info" className="w-5 h-5 text-info mt-0.5" />
          <div className="text-sm text-gray-400">
            <p className="font-medium text-gray-300 mb-1">Troubleshooting Tips:</p>
            <ul className="space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Verify the API service is available</li>
              <li>• Try searching for a different entity</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;