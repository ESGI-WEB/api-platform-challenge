import './App.css'
import Login from "./pages/Login.jsx";
import GlobalFooter from "./components/GlobalFooter.jsx";
import GlobalHeader from "./components/GlobalHeader.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import useAuth from "./auth/useAuth.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

function App() {
    const loginButton = {
        iconId: 'fr-icon-user-line',
        linkProps: {
            to: '/login',
        },
        text: 'Se connecter'
    };
    const logoutButton = {
        iconId: 'fr-icon-user-line',
        linkProps: {
            onClick: () => onLogout(),
        },
        text: 'Se déconnecter'
    }
    const adminButton = {
        iconId: 'fr-icon-user-line',
        linkProps: {
            to: '/admin',
        },
        text: 'Admin'
    }
    let quickAccessItems = [loginButton];
    const {onLogin, onLogout, token} = useAuth();

    if (token) {
        quickAccessItems = [logoutButton, adminButton]
    }

    return (
        <>
            <GlobalHeader quickAccessItems={quickAccessItems}/>
            <div id="main-page-container">
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login onLoginSuccessful={onLogin}/>} />
                    <Route path="admin" element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <GlobalFooter />
        </>
    )
}

export default App
