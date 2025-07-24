import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-4">
      <motion.div 
        className="animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-700">
          <div>
            <div className="h-6 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-48"></div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="bg-surface border border-gray-700 rounded-lg p-6 animate-pulse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-700 rounded w-64 mb-3"></div>
                <div className="h-6 bg-gradient-to-r from-error to-error/80 rounded w-24"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-800 rounded w-4"></div>
                <div className="h-4 bg-gray-800 rounded w-16"></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="h-4 bg-gray-800 rounded w-24 mb-2"></div>
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 bg-gray-800 rounded w-20"></div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-800 rounded w-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-16"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-800 rounded w-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-20"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-800 rounded w-5"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;