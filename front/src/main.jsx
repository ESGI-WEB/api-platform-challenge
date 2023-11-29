import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import i18n from './i18n';
import {BrowserRouter, Link} from "react-router-dom";
import {startReactDsfr} from "@codegouvfr/react-dsfr/spa";
import AuthProvider from "./auth/AuthProvider.jsx";

// France's components library
startReactDsfr({defaultColorScheme: "system", Link, useLang: () => i18n.language});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
