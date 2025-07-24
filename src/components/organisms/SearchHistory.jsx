import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import HistoryItem from "@/components/molecules/HistoryItem";

const SearchHistory = ({ history, onHistoryClick, onClearHistory }) => {
  return (
    <motion.div 
      className="bg-surface border border-gray-700 rounded-lg p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
          Recent Searches
        </h3>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-gray-400 hover:text-error"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No recent searches</p>
            <p className="text-gray-500 text-xs mt-1">Your search history will appear here</p>
          </div>
        ) : (
history.map((item, index) => (
            <HistoryItem
              key={item.Id || item.id || `${item.query}-${index}` || index}
              query={item}
              onClick={onHistoryClick}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default SearchHistory;