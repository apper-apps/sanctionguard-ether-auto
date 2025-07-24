import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import SearchResults from "@/components/organisms/SearchResults";
import SearchHistory from "@/components/organisms/SearchHistory";
import EntityDetailModal from "@/components/organisms/EntityDetailModal";
import sanctionsService from "@/services/api/sanctionsService";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityDetails, setEntityDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    const history = sanctionsService.getSearchHistory();
    setSearchHistory(history);
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError("");
    setSearchQuery(query);
    setSearchResults(null);

    try {
      const results = await sanctionsService.searchEntities(query);
      setSearchResults(results);
      loadSearchHistory(); // Refresh history after search
      
      toast.success(`Found ${results.totalCount} entities in ${results.searchTime}s`);
    } catch (err) {
      setError(err.message);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEntityClick = async (entity) => {
    setSelectedEntity(entity);
    setModalOpen(true);
    setDetailsLoading(true);
    setDetailsError("");
    setEntityDetails(null);

    try {
      const details = await sanctionsService.getEntityDetails(entity.id);
      setEntityDetails(details);
    } catch (err) {
      setDetailsError(err.message);
      toast.error("Failed to load entity details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleHistoryClick = (query) => {
    handleSearch(query);
  };

  const handleClearHistory = () => {
    sanctionsService.clearSearchHistory();
    setSearchHistory([]);
    toast.success("Search history cleared");
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEntity(null);
    setEntityDetails(null);
    setDetailsError("");
  };

  const handleRetry = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Sanctions <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">Screening</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Search global sanctions databases to verify entities and individuals for AML compliance. 
            Get instant results with detailed risk assessments.
          </p>
        </div>
        
        <SearchBar 
          onSearch={handleSearch}
          loading={loading}
          placeholder="Enter entity name, individual, or organization to screen..."
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SearchResults
            results={searchResults}
            loading={loading}
            error={error}
            onEntityClick={handleEntityClick}
            onRetry={handleRetry}
            searchQuery={searchQuery}
          />
        </div>
        
        <div className="lg:col-span-1">
          <SearchHistory
            history={searchHistory}
            onHistoryClick={handleHistoryClick}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>

      <EntityDetailModal
        entity={entityDetails}
        isOpen={modalOpen}
        onClose={handleModalClose}
        loading={detailsLoading}
        error={detailsError}
      />
    </div>
  );
};

export default SearchPage;