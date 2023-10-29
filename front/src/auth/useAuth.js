import {createContext, useContext} from "react";

export const Roles = {
    ADMIN: 'ROLE_ADMIN',
    USER: 'ROLE_USER',
    PROVIDER: 'ROLE_PROVIDER',
}
export const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used in an AuthProvider');
  }

  return context;
}

export default useAuth;