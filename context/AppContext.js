'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userName, setUserName] = useState('');
  const [menuOrder, setMenuOrder] = useState('');
  const [performedSongs, setPerformedSongs] = useState([]);

  const togglePerformed = (songId) => {
    setPerformedSongs((prev) => 
      prev.includes(songId) ? prev : [...prev, songId]
    );
  };

  const resetPerformed = () => setPerformedSongs([]);

  const value = {
    userName,
    setUserName,
    menuOrder,
    setMenuOrder,
    performedSongs,
    togglePerformed,
    resetPerformed,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
