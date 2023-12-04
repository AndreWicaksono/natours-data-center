import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export type AuthContext_Object = {
  authContext: {
    createdAt: string | null;
    email: string | null;
    firstName: string | null;
    id: string | null;
    isActive: boolean | null;
    lastName: string | null;
    photo: { id: string | null; location: string | null };
  };
  setAuthContext: Dispatch<SetStateAction<AuthContext_Object["authContext"]>>;
};

const defaultValueAuthContext = {
  createdAt: null,
  email: null,
  firstName: null,
  id: null,
  isActive: null,
  lastName: null,
  photo: { id: null, location: null },
};

export const AuthContext = createContext<AuthContext_Object | null>(null);

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authContext, setAuthContext] = useState<
    AuthContext_Object["authContext"]
  >(defaultValueAuthContext);

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext }}>
      {children}
    </AuthContext.Provider>
  );
};
