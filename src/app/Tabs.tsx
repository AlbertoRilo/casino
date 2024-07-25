// src/app/components/Tabs.tsx
"use client";

import React, { useState } from 'react';
import CasinoForm from './CasinoForm';
import GameForm from './GameForm';

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'casino' | 'game'>('casino');

  const handleTabChange = (tab: 'casino' | 'game') => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex mb-4">
        <button
          className={`mr-4 px-4 py-2 ${activeTab === 'casino' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} rounded`}
          onClick={() => handleTabChange('casino')}
        >
          Casino
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'game' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} rounded`}
          onClick={() => handleTabChange('game')}
        >
         Game
        </button>
      </div>
      {activeTab === 'casino' && <CasinoForm />}
      {activeTab === 'game' && <GameForm />}
    </div>
  );
};

export default Tabs;
