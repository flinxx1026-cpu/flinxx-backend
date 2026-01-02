import React, { createContext, useContext, useState } from 'react';

const DuoSquadContext = createContext();

export const DuoSquadProvider = ({ children }) => {
  const [isDuoSquadOpen, setIsDuoSquadOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('solo'); // 'solo' | 'duo'

  const openDuoSquad = () => {
    setIsDuoSquadOpen(true);
    setActiveMode('duo');
  };

  const closeDuoSquad = () => {
    setIsDuoSquadOpen(false);
    setActiveMode('solo');
  };

  const handleModeChange = (mode) => {
    console.log(`🔄 [MODE CHANGE] Switching to ${mode} mode`);
    console.log(`   Current activeMode before: ${activeMode}`);
    setActiveMode(mode);
    
    // If switching to 'duo', open the modal
    if (mode === 'duo') {
      console.log("Opening Duo Squad modal");
      setIsDuoSquadOpen(true);
    } else if (mode === 'solo') {
      // If switching to 'solo', close the modal
      console.log("Closing Duo Squad modal");
      setIsDuoSquadOpen(false);
    }
    
    console.log(`   activeMode will update to: ${mode}`);
  };

  return (
    <DuoSquadContext.Provider
      value={{
        isDuoSquadOpen,
        setIsDuoSquadOpen,
        activeMode,
        setActiveMode,
        openDuoSquad,
        closeDuoSquad,
        handleModeChange
      }}
    >
      {children}
    </DuoSquadContext.Provider>
  );
};

export const useDuoSquad = () => {
  const context = useContext(DuoSquadContext);
  if (!context) {
    throw new Error('useDuoSquad must be used within DuoSquadProvider');
  }
  return context;
};
