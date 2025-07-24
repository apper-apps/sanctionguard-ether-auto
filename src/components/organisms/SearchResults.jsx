import React from "react";
import { motion } from "framer-motion";
import EntityCard from "@/components/molecules/EntityCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const SearchResults = ({ 
  results, 
  loading, 
  error, 
  onEntityClick, 
  onRetry, 
  searchQuery 
}) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
}

  if (!results || !results.entities || results.entities.length === 0) {
    return <Empty searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-4">
      <motion.div 
        className="flex items-center justify-between pb-4 border-b border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
<div>
          <h2 className="text-xl font-semibold text-white">Search Results</h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400">
              Found {results?.totalCount || 0} entities in {(results?.searchTime || 0).toFixed(2)}s
            </p>
            {results?.source && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  results.source === 'api' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <span className={`text-xs font-medium ${
                  results.source === 'api' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {results.source === 'api' ? 'Live API' : 'Cached Data'}
                </span>
                {results.fallbackReason && (
                  <span className="text-xs text-gray-500" title={results.fallbackReason}>
                    ({results.fallbackReason.split(' - ')[0]})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
transition={{ duration: 0.4, delay: 0.1 }}
      >
        {(results?.entities || []).map((entity, index) => (
          <motion.div
            key={entity?.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <EntityCard
              entity={entity}
              onClick={onEntityClick}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchResults;