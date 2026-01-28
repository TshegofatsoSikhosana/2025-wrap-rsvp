'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userName, setUserName] = useState('');
  const [menuOrder, setMenuOrder] = useState('');

  // Persist to local storage helper if needed, 
  // but for now just memory as it's a SPA-like flow
  
  const value = {
    userName,
    setUserName,
    menuOrder,
    setMenuOrder,
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
