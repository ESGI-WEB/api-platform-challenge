import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {AuthContext, Roles} from "./useAuth.js";
import jwtDecode from "jwt-decode";

export default function AuthProvider({ children }) {
    const localKey = "token";
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(JSON.parse(localStorage.getItem(localKey)));
    const [data, setData] = useState(token ? jwtDecode(token) : null);

    const handleLogin = (token) => {
        setToken(token);
        const tokenData = jwtDecode(token);
        setData(tokenData);

        const originalPath = location.state?.from?.pathname;
        if (originalPath && !originalPath.includes('/login')) {
            navigate(originalPath);
            return;
        }

        if (token && tokenData.roles.includes(Roles.ADMIN)) {
            navigate('/admin');
            return;
        }

        navigate('/');
    };

    const handleLogout = () => {
        setToken(null);
        setData(null);
    };

    useEffect(() => {
        localStorage.setItem(localKey, JSON.stringify(token));
    }, [token]);

    const value = {
        token,
        data,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}