import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const EntityCard = ({ entity, onClick }) => {
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
    <motion.div
      className="bg-surface border border-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:border-accent hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02]"
      onClick={() => onClick(entity)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{entity.name}</h3>
          <Badge variant={getRiskVariant(entity.riskScore)}>
            {getRiskLabel(entity.riskScore)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <ApperIcon name="MapPin" className="w-4 h-4" />
          <span className="text-sm">{entity.country}</span>
        </div>
      </div>

      {entity.aliases && entity.aliases.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Also known as:</p>
          <div className="flex flex-wrap gap-1">
            {entity.aliases.slice(0, 3).map((alias, index) => (
              <span
                key={index}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
              >
                {alias}
              </span>
            ))}
            {entity.aliases.length > 3 && (
              <span className="text-xs text-gray-500">
                +{entity.aliases.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Shield" className="w-4 h-4 text-warning" />
            <span className="text-sm text-gray-300">
              {entity.sanctionPrograms.length} program{entity.sanctionPrograms.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Calendar" className="w-4 h-4 text-info" />
            <span className="text-sm text-gray-300">
              {new Date(entity.dateAdded).toLocaleDateString()}
            </span>
          </div>
        </div>
        <ApperIcon name="ChevronRight" className="w-5 h-5 text-accent" />
      </div>
    </motion.div>
  );
};

export default EntityCard;