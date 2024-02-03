import './App.css'
import Login from "./pages/Login.jsx";
import GlobalFooter from "./components/GlobalFooter.jsx";
import GlobalHeader from "./components/GlobalHeader.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from "./pages/admin/Admin.jsx";
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
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui.js";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector.jsx";
import Appointments from "./pages/Appointments.jsx";
import {headerFooterDisplayItem} from "@codegouvfr/react-dsfr/Display";
import Employees from "./pages/Employees.jsx";
import Employee from "./pages/Employee.jsx";
import ManageTeams from "./pages/ManageTeams.jsx";
import Register from "./pages/Register.jsx";
import RegisterOrganisation from "./pages/RegisterOrganisation.jsx"
function App() {
    const {t} = useTranslation();
    const [translationsLoaded, setTranslationsLoaded] = useState(true);
    const {onLogin, onLogout, token, data} = useAuth();

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
    const languageSelector = {
        linkProps: {},
        text: <LanguageSelector/>
    }
    const navigation = [
        {
            role: [Roles.ADMIN, Roles.PROVIDER, Roles.EMPLOYEE],
            iconId: 'fr-icon-user-line',
            linkProps: {
                to: '/admin',
            },
            text: t('admin')
        },
        {
            role: Roles.PROVIDER,
            linkProps: {
                to: '/providers-organisations',
            },
            text: t('your_police_stations'),
        },
        {
            role: Roles.USER,
            linkProps: {
                to: '/appointments',
            },
            text: t('your_appointments'),
        },
        {
            role: Roles.PROVIDER,
            linkProps: {
                to: '/employees',
            },
            text: t('employees'),
        },
        {
            role: Roles.PROVIDER,
            linkProps: {
                to: '/manage-teams',
            },
            text: t('manage_teams'),
        },
        {
            role: Roles.EMPLOYEE,
            linkProps: {
                to: '/employees/' + data?.id,
            },
            text: t('profile'),
        },
    ];
    let quickAccessItems = [loginButton];
    let navigationItemsByRole = [];
    let serviceTitle = '';

    if (token) {
        quickAccessItems = [logoutButton]
        if (data.roles.includes(Roles.ADMIN)) {
            serviceTitle = <Badge as="span" noIcon severity="warning">{t('admin')}</Badge>
        } else if (data.roles.includes(Roles.PROVIDER)) {
            serviceTitle = <Badge as="span" noIcon severity="info">{t('superintendent')}</Badge>
        } else if (data.roles.includes(Roles.EMPLOYEE)) {
            serviceTitle = <Badge as="span" noIcon severity="info">{t('employee')}</Badge>
        }


        navigationItemsByRole = navigation.filter((item) => {
            if (location.pathname === item.linkProps.to) {
                item.isActive = true;
            }

            if (item.role === undefined) {
                return true;
            } else if (Array.isArray(item.role)) {
                return item.role.some((role) => data.roles.includes(role));
            } else {
                return data.roles.includes(item.role);
            }
        });
    }

    quickAccessItems.push(headerFooterDisplayItem, languageSelector);

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
                                <Route path="register" element={
                                    <Register/>
                                }/>
                                <Route path="register-organisation" element={
                                    <RegisterOrganisation/>
                                }/>
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
                                        <ProtectedRoute requiredRoles={[Roles.ADMIN, Roles.PROVIDER, Roles.EMPLOYEE]}>
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
                                {/*<Route path="prestations" element={*/}
                                {/*    <ProtectedRoute requiredRoles={Roles.PROVIDER}>*/}
                                {/*        <LandingPagePresta/>*/}
                                {/*    </ProtectedRoute>*/}
                                {/*}/>*/}
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
                                <Route path="appointments" element={
                                    <ProtectedRoute requiredRole={Roles.USER}>
                                        <Appointments/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="employees" element={
                                    <ProtectedRoute requiredRole={Roles.EMPLOYEE}>
                                        <Employees/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="manage-teams" element={
                                    <ProtectedRoute requiredRole={Roles.PROVIDER}>
                                        <ManageTeams/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="employees/:employeeId" element={
                                    <ProtectedRoute requiredRole={Roles.EMPLOYEE}>
                                        <Employee/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="403" element={<NoTranslations/>}/>
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