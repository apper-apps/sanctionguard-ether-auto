import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ onSearch, loading, placeholder = "Enter entity name to search..." }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-12 pr-12 h-14 text-base bg-surface border-2 border-gray-600 focus:border-accent"
            disabled={loading}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-14 px-8 bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90"
          disabled={!query.trim() || loading}
        >
          {loading ? (
            <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ApperIcon name="Search" className="w-5 h-5 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-gray-400">Quick search examples:</span>
        {["Vladimir Putin", "Sberbank", "Kim Jong Un"].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setQuery(example)}
            className="text-sm text-accent hover:text-accent/80 underline transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </motion.form>
  );
};

export default SearchBar;