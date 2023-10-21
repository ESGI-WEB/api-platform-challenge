import {useContext} from "react";
import {AuthContext} from "./AuthProvider.jsx";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used in an AuthProvider');
  }

  return context;
}

export default useAuth;