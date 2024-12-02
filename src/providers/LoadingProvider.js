import { createContext, useState } from "react";

export const LoadingContext = createContext();

function LoadingProvider({ children }) {
  const [Loading, setLoading] = useState(undefined);

  return (
    <LoadingContext.Provider value={{ Loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export default LoadingProvider;
