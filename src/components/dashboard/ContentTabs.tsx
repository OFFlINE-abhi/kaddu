import React from "react";
import { tabIcons } from "@/lib/constants";
import { motion } from "framer-motion";

interface ContentTabsProps {
  activeTab: keyof typeof tabIcons;
  setActiveTab: React.Dispatch<React.SetStateAction<keyof typeof tabIcons>>;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start py-2 px-4">
      {Object.entries(tabIcons).map(([key, Icon]) => {
        const isActive = activeTab === key;
        return (
          <motion.button
            key={key}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab(key as keyof typeof tabIcons)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-white hover:bg-blue-500 hover:text-white"
              }`}
          >
            <Icon className="w-5 h-5" />
            <span className="capitalize">{key}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ContentTabs;
