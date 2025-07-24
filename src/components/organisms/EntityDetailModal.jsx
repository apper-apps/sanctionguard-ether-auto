import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const EntityDetailModal = ({ entity, isOpen, onClose, loading, error }) => {
  if (!isOpen) return null;

  const getRiskVariant = (score) => {
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  };

  const getRiskLabel = (score) => {
    if (score >= 80) return "HIGH RISK";
    if (score >= 50) return "MEDIUM RISK";
    return "LOW RISK";
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-background border border-gray-700 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-accent" />
              <span className="ml-3 text-gray-400">Loading entity details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
              <p className="text-error mb-4">{error}</p>
              <Button onClick={onClose} variant="outline">Close</Button>
            </div>
          ) : entity ? (
            <>
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-3">{entity.name}</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant={getRiskVariant(entity.riskScore)}>
                      {getRiskLabel(entity.riskScore)} ({entity.riskScore}%)
                    </Badge>
                    <div className="flex items-center gap-2 text-gray-400">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span>{entity.country}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                  <div className="space-y-4 bg-surface p-6 rounded-lg border border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Primary Name
                      </label>
                      <p className="text-white">{entity.name}</p>
                    </div>
                    
                    {entity.aliases && entity.aliases.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Known Aliases
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {entity.aliases.map((alias, index) => (
                            <span
                              key={index}
                              className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                            >
                              {alias}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Date Added to List
                      </label>
                      <p className="text-white">
                        {new Date(entity.dateAdded).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Identifiers</h3>
                  <div className="space-y-4 bg-surface p-6 rounded-lg border border-gray-700">
                    {Object.entries(entity.identifiers || {}).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <p className="text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

<div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Sanctions Programs</h3>
                <div className="space-y-4">
                  {(entity.sanctionPrograms || []).map((program, index) => (
                    <div
                      key={index}
                      className="bg-surface p-4 rounded-lg border border-gray-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <ApperIcon name="Shield" className="w-5 h-5 text-warning" />
                        <span className="text-white font-medium">{program}</span>
                      </div>
                      <Badge variant="warning">Active</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {entity.details && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
                  <div className="bg-surface p-6 rounded-lg border border-gray-700">
                    {entity.details.reason && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Reason for Listing
                        </label>
                        <p className="text-white">{entity.details.reason}</p>
                      </div>
                    )}
                    {entity.details.description && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Description
                        </label>
                        <p className="text-white">{entity.details.description}</p>
                      </div>
                    )}
                    {entity.details.programs && entity.details.programs.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          Program Details
                        </label>
                        <div className="space-y-3">
                          {entity.details.programs.map((program, index) => (
                            <div key={index} className="bg-background p-4 rounded border border-gray-700">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-white">{program.name}</h4>
                                <span className="text-sm text-gray-400">{program.reference}</span>
                              </div>
                              <p className="text-sm text-gray-400">
                                Listed: {new Date(program.listingDate).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-accent to-secondary">
                  <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EntityDetailModal;