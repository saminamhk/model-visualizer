import React, { createContext, useContext, useState, ReactNode } from "react";
import { ViewInfo, Views } from "../components/views/views";

type ViewContextType = {
  currentView: ViewInfo;
  setCurrentView: (view: ViewInfo) => void;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewInfo>(Views["default"]);

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
