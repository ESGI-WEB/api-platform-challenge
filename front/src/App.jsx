import './App.css'
import Login from "./pages/Login.jsx";
import GlobalFooter from "./components/GlobalFooter.jsx";
import GlobalHeader from "./components/GlobalHeader.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from "./pages/admin/Admin.jsx";
import LandingPagePresta from "./pages/LandingPagePresta.jsx";
import CreateOrganisation from "./pages/CreateOrganisation.jsx";
import ProvidersOrganisations from "./pages/ProvidersOrganisations.jsx";
import useAuth, {Roles} from "./auth/useAuth.js";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import Organisation from "./pages/Organisation.jsx";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import {useEffect, useState} from "react";
import NoTranslations from "./pages/NoTranslations.jsx";
import Appointment from "./pages/Appointment.jsx";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui.js";

function App() {
    startReactDsfr({ defaultColorScheme: "system" });
    const {t} = useTranslation();
    const [translationsLoaded, setTranslationsLoaded] = useState(true);

    useEffect(() => {
        if (i18n.failedLoadings.length > 0) {
            setTranslationsLoaded(false);
        }
    }, []);

    const loginButton = {
        iconId: 'fr-icon-user-line',
        linkProps: {
            to: '/login',
        },
        text: t('login')
    };
    const logoutButton = {
        iconId: 'fr-icon-user-line',
        linkProps: {
            onClick: () => onLogout(),
        },
        text: t('logout')
    }
    const adminButton = {
        iconId: 'fr-icon-user-line',
        linkProps: {
            to: '/admin',
        },
        text: t('admin')
    }
    const navigation = [
        {
            role: Roles.PROVIDER,
            linkProps: {
                to: '/providers-organisations',
            },
            text: t('your_police_stations'),
        },
    ];
    let quickAccessItems = [loginButton];
    let navigationItemsByRole = [];
    let serviceTitle = '';
    const {onLogin, onLogout, token, data} = useAuth();

    if (token) {
        quickAccessItems = [logoutButton]
        if (data.roles.includes(Roles.ADMIN)) {
            quickAccessItems.push(adminButton);
            serviceTitle = <Badge as="span" noIcon severity="warning">{t('admin')}</Badge>
        } else if (data.roles.includes(Roles.PROVIDER)) {
            serviceTitle = <Badge as="span" noIcon severity="info">{t('superintendent')}</Badge>
        }

        navigationItemsByRole = navigation.filter((item) => {
            if (location.pathname === item.linkProps.to) {
                item.isActive = true;
            }
            return item.role === undefined || data.roles.includes(item.role);
        });
    }

    return (
        <>
            <MuiDsfrThemeProvider>

                <GlobalHeader
                    quickAccessItems={quickAccessItems}
                    serviceTitle={serviceTitle}
                    navigation={navigationItemsByRole}
                />
                <div id="main-page-container">
                    <div className="fr-col-10">
                        {translationsLoaded ?
                            <Routes>
                                <Route index element={<Home/>}/>
                                <Route
                                    path="login"
                                    element={
                                        <Login
                                            onLoginSuccessful={onLogin}
                                        />
                                    }
                                />
                                <Route
                                    path="admin"
                                    element={
                                        <ProtectedRoute requiredRoles={[Roles.ADMIN]}>
                                            <Admin/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="station/:organisationId" element={
                                    <ProtectedRoute>
                                        <Organisation/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="appointment/:appointmentId" element={
                                    <ProtectedRoute>
                                        <Appointment/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="prestations" element={
                                    <ProtectedRoute requiredRoles={Roles.PROVIDER}>
                                        <LandingPagePresta/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="create-organisation" element={
                                    <ProtectedRoute requiredRole={Roles.PROVIDER}>
                                        <CreateOrganisation/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="providers-organisations" element={
                                    <ProtectedRoute requiredRole={Roles.PROVIDER}>
                                        <ProvidersOrganisations/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="*" element={<Navigate to="/" replace/>}/>
                            </Routes>
                            :
                            <NoTranslations/>
                        }
                    </div>
                </div>
                <GlobalFooter/>
            </MuiDsfrThemeProvider>
        </>
    );
}

export default App;