// src/app/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF1D25"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <h1 className="text-3xl font-bold ml-2">Project Spark Database</h1>
        </div>
        {/* Aquí podrías agregar más elementos del header como un menú, enlaces, etc. */}
      </div>
    </header>
  );
};

export default Header;
