import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {AuthContext, Roles} from "./useAuth.js";
import {jwtDecode} from "jwt-decode";

export default function AuthProvider({children}) {
    const localKey = "token";
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(null);
    const [data, setData] = useState(null);
    const [isSettingToken, setIsSettingToken] = useState(true);

    const setSavedToken = () => {
        const tokenSaved = localStorage.getItem(localKey) || null;
        const token = tokenSaved ? JSON.parse(tokenSaved) : null;
        const data = token ? jwtDecode(token) : null

        if (token && data && new Date(data.exp * 1000) > new Date()) {
            setToken(token);
            setData(data);
        }

        setIsSettingToken(false);
    }

    useEffect(() => {
        setSavedToken();
    }, []);

    const handleLogin = (token) => {
        setToken(token);
        const tokenData = jwtDecode(token);
        setData(tokenData);

        const originalPath = location.state?.from?.pathname;
        if (originalPath && !originalPath.includes('/login')) {
            navigate(originalPath, {replace: true});
            return;
        }

        if (token && tokenData.roles.includes(Roles.ADMIN)) {
            navigate('/admin', {replace: true});
            return;
        }

        navigate('/', {replace: true});
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
            {!isSettingToken && children}
        </AuthContext.Provider>
    );
}