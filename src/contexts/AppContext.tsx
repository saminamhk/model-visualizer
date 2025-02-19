import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCustomAppContext, CustomAppContext } from "@kontent-ai/custom-app-sdk";

const AppContext = createContext<CustomAppContext>({} as CustomAppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [customAppContext, setCustomAppContext] = useState<CustomAppContext>();

  useEffect(() => {
    const init = async () => {
      const response = await getCustomAppContext();
      setCustomAppContext(response);
    };
    init();
  }, []);

  return (
    <AppContext.Provider value={customAppContext!}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
