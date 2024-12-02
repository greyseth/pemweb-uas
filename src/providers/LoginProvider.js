import { createContext, useState } from "react";

export const LoginContext = createContext();

function LoginProvider({ children }) {
  const [login, setLogin] = useState(undefined);

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
