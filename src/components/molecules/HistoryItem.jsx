import React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const HistoryItem = ({ query, onClick }) => {
  return (
    <motion.div
      className="flex items-center justify-between p-3 bg-surface border border-gray-700 rounded-lg cursor-pointer hover:border-accent hover:bg-surface/80 transition-all duration-200 group"
      onClick={() => onClick(query.query)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
          {query.query}
        </p>
        <p className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(query.timestamp), { addSuffix: true })}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <span className="text-xs text-gray-500">
          {query.resultCount} result{query.resultCount !== 1 ? 's' : ''}
        </span>
        <ApperIcon name="RotateCcw" className="w-4 h-4 text-gray-500 group-hover:text-accent transition-colors" />
      </div>
    </motion.div>
  );
};

export default HistoryItem;