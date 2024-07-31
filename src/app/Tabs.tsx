// Tabs.tsx
'use client'
import React, { useState } from 'react';
import CasinoForm from './CasinoForm';
import UploadCSVForm from './UploadCSVForm';
import axios from 'axios';

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'casino' | 'upload'>('casino');

  const handleCasinoFormSubmit = async (formData: any) => {
    try {
      let apiUrl;
      if (process.env.NODE_ENV === 'development') {
        apiUrl = 'http://localhost:5000/api';
      } else {
        apiUrl = process.env.REACT_APP_API_URL;
      }
  
      const response = await axios.post(`${apiUrl}/casino`,formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Casino form submitted:', response.data);
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <button
            className={`px-4 py-2 mr-4 rounded ${activeTab === 'casino' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('casino')}
          >
            Add New Casino
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload CSV
          </button>
        </div>
        {activeTab === 'casino' && <CasinoForm onSubmit={handleCasinoFormSubmit} />}
        {activeTab === 'upload' && <UploadCSVForm />}
      </div>
    </div>
  );
};

export default Tabs;