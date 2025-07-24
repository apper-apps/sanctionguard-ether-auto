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

  if (!results || results.entities.length === 0) {
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
          <p className="text-sm text-gray-400">
            Found {results.totalCount} entities in {results.searchTime}s
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {results.entities.map((entity, index) => (
          <motion.div
            key={entity.id}
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