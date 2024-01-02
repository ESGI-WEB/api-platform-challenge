import useAuth from "../auth/useAuth.js";
import {useLocation, useNavigate} from "react-router-dom";

const useApi = () => {
    const {token, data} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = import.meta.env.VITE_API_ENDPOINT;

    return (url, options = {}, hydra = false, withAuthToken = true) => {
        const headers = {
            ...options.headers,
        };

        if (token && !options.headers?.Authorization && withAuthToken) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (options.body && typeof options.body !== 'string') {
            options.body = JSON.stringify(options.body);
        }

        const type = hydra ? 'application/ld+json' : 'application/json';

        if (!headers['Content-Type']) {
            headers['Content-Type'] = type;
        }

        if (!headers['Accept']) {
            headers['Accept'] = type;
        }

        return fetch(`${baseUrl}/${url}`, {...options, headers}).then(response => {
            if (response.ok) {
                // check if content is a csv file
                if (response.headers.get('Content-Type').includes('text/csv')) {
                    // download file to user
                    return response.blob().then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'export.csv';
                        a.click();
                        a.remove();
                    });
                }
                return response.json();
            }

            // need to authenticate, redirect to login page
            if (response.status === 401) {
                navigate('/login', {state: {from: location}});
            }

            return response.json().then(error => {
                const e = new Error(response.statusText);
                e.data = error;
                throw e;
            });
        });
    }
};

export default useApi;