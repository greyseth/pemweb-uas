import { createContext, useState } from "react";

export const WarningContext = createContext();

function WarningProvider({ children }) {
  const [Warning, setWarning] = useState(undefined);

  return (
    <WarningContext.Provider value={{ Warning, setWarning }}>
      {children}
    </WarningContext.Provider>
  );
}

export default WarningProvider;
