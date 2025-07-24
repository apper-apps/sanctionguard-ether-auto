import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ApiStatus from "@/components/molecules/ApiStatus";

const Header = () => {
  return (
    <motion.header 
      className="bg-surface border-b border-gray-700 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SanctionGuard</h1>
              <p className="text-sm text-gray-400">AML Sanctions Screening</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ApiStatus />
          <div className="text-right">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;