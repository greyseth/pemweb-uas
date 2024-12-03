import { createContext, useState } from "react";

export const WarningContext = createContext();

function WarningProvider({ children }) {
  const [warning, setWarning] = useState(undefined);

  return (
    <WarningContext.Provider value={{ warning, setWarning }}>
      {children}
    </WarningContext.Provider>
  );
}

export default WarningProvider;
