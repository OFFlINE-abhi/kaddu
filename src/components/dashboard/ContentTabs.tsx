import React from 'react';
import { tabIcons } from '@/lib/constants';

interface ContentTabsProps {
  activeTab: keyof typeof tabIcons;
  setActiveTab: React.Dispatch<React.SetStateAction<keyof typeof tabIcons>>;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs-container">
      {Object.entries(tabIcons).map(([key, Icon]) => (
        <button
          key={key}
          className={`tab-button ${activeTab === key ? 'active' : ''}`}
          onClick={() => setActiveTab(key as keyof typeof tabIcons)}
        >
          <Icon className="w-5 h-5 mr-2" />
          {key}
        </button>
      ))}
    </div>
  );
};

export default ContentTabs;
