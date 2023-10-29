import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n';
import {BrowserRouter, Link} from "react-router-dom";

// France's components library
import {startReactDsfr} from "@codegouvfr/react-dsfr/spa";
import AuthProvider from "./auth/AuthProvider.jsx";

startReactDsfr({defaultColorScheme: "system", Link});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
