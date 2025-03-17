import React, { createContext, useContext, useState, ReactNode } from "react";
import { ViewType } from "../types/views";

type ViewContextType = {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>("default");

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within ViewProvider");
  }
  return context;
};
