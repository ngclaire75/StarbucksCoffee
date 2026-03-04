'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './menutabs.css'; // separate CSS file for styling

export default function MenuTabs({ activeTab, tabs }) {
  const [currentTab, setCurrentTab] = useState(activeTab || tabs[0].id);
  const router = useRouter();

  const handleClick = (tab) => {
    setCurrentTab(tab.id);
    if (tab.href) {
      router.push(tab.href);
    }
  };

  return (
    <div className="menu-tabs-wrapper">
      <div className="menu-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`menu-tab ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => handleClick(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Divider line under the buttons */}
      <div className="menu-tabs-divider"></div>
    </div>
  );
}