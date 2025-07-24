import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ searchQuery }) => {
  const suggestions = [
    "Try searching for a person's full name",
    "Search for organization or company names", 
    "Check spelling and try alternative name formats",
    "Use known aliases or alternative spellings"
  ];

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full flex items-center justify-center mb-8">
        <ApperIcon name="Search" className="w-10 h-10 text-accent" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">No Sanctions Found</h3>
      <p className="text-gray-400 mb-2 text-lg">
        {searchQuery ? (
          <>No sanctions records found for "<span className="text-accent font-medium">{searchQuery}</span>"</>
        ) : (
          "No entities found matching your search criteria"
        )}
      </p>
      <p className="text-gray-500 mb-8">
        This entity does not appear in the current sanctions databases.
      </p>

      <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/30 rounded-lg p-6 mb-8 max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
          <h4 className="font-semibold text-success">Clear Result</h4>
        </div>
        <p className="text-sm text-gray-300">
          This search result indicates the entity is not currently listed on major sanctions lists, 
          which is typically a positive compliance outcome.
        </p>
      </div>

      <div className="space-y-6 max-w-lg">
        <div>
          <h4 className="font-semibold text-white mb-4">Search Suggestions:</h4>
          <div className="grid gap-3 text-left">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 bg-surface border border-gray-700 rounded-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ApperIcon name="Lightbulb" className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">{suggestion}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            New Search
          </Button>
          <Button className="bg-gradient-to-r from-accent to-secondary">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export Clear Result
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;