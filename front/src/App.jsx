import './App.css'
import Login from "./pages/Login.jsx";
import GlobalFooter from "./components/GlobalFooter.jsx";
import GlobalHeader from "./components/GlobalHeader.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from "./pages/admin/Admin.jsx";
import useAuth, {Roles} from "./auth/useAuth.js";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import Service from "./pages/Service.jsx";

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
    let serviceTitle = '';
    const {onLogin, onLogout, token, data} = useAuth();

    if (token) {
        quickAccessItems = [logoutButton]
        if (data.roles.includes(Roles.ADMIN)) {
            quickAccessItems.push(adminButton);
            serviceTitle = <Badge as="span" noIcon severity="warning">Admin</Badge>
        } else if (data.roles.includes(Roles.PROVIDER)) {
            serviceTitle = <Badge as="span" noIcon severity="info">Commissaire</Badge>
        }
    }

    return (
        <>
            <GlobalHeader
                quickAccessItems={quickAccessItems}
                serviceTitle={serviceTitle}
            />
            <div id="main-page-container">
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="login" element={
                        <Login
                            onLoginSuccessful={onLogin}
                        />
                    } />
                    <Route path="admin" element={
                        <ProtectedRoute requiredRole={Roles.ADMIN}>
                            <Admin />
                        </ProtectedRoute>
                    } />
                    <Route path="service/:serviceId" element={
                        <Service />
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <GlobalFooter />
        </>
    )
}

export default App
