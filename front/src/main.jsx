import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Link} from "react-router-dom";

// France's components library
import {startReactDsfr} from "@codegouvfr/react-dsfr/spa";

startReactDsfr({defaultColorScheme: "system", Link});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
)
