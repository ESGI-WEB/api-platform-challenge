import {createContext, useState} from "react";
import {useNavigate} from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    // todo navigate to next page
    const handleLogin = (token) => {
        setToken(token);
        navigate('/admin');
    };

    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}