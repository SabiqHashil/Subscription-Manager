import React, { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * App Context for global state
 */
const AppContext = createContext();

/**
 * App reducer
 */
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SIDEBAR_OPEN':
      return { ...state, isSidebarOpen: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    default:
      return state;
  }
};

/**
 * App Provider Component
 */
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    isSidebarOpen: true,
    theme: localStorage.getItem('theme') || 'light',
  });

  /**
   * Toggle sidebar
   */
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  /**
   * Set sidebar open state
   */
  const setSidebarOpen = useCallback((isOpen) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: isOpen });
  }, []);

  /**
   * Set theme
   */
  const setTheme = useCallback((theme) => {
    localStorage.setItem('theme', theme);
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const value = {
    ...state,
    toggleSidebar,
    setSidebarOpen,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Use App Hook
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
