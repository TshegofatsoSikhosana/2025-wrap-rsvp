'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userName, setUserName] = useState('');
  const [menuOrder, setMenuOrder] = useState('');
  const [performedSongs, setPerformedSongs] = useState([]);

  // RSVP Deadline: Jan 30, 2026 at 12:00 PM
  const DEADLINE = new Date('2026-01-30T12:00:00');
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    const checkDeadline = () => {
      setIsDeadlinePassed(new Date() >= DEADLINE);
    };
    checkDeadline();
    const interval = setInterval(checkDeadline, 1000 * 60); // Check every minute
    return () => clearInterval(interval);
  }, []);

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
    isDeadlinePassed,
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
