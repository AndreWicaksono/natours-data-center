import { useContext } from "react";

import { AuthContext } from "src/context/AuthContext";

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("You need to use this hook inside a context provider");

  return authContext;
};
