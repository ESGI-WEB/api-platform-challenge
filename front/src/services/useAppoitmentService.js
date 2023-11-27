import useApi from './useApi';
import useAuth from "../auth/useAuth.js";

const useAppointmentService = () => {
    const api = useApi();
    const {data} = useAuth();
    return {
        create: (appointment) => api('appointments', {
            method: 'POST',
            body: JSON.stringify(appointment),
        }),
        getClientAppointment: (id) => api(`users/${data.id}/client_appointments/${id}`, {
            method: 'GET',
        }),
        getClientAppointments: (page, filters = null) => {
            let url = `users/${data.id}/client_appointments?page=${page}`;
            if (filters) {
                Object.keys(filters).forEach(key => url += `&${key}=${filters[key]}`);
            }

            return api(url, {
                method: 'GET',
            }, true)
        },
        getProviderAppointments: (page, filters = null) => {
            let url = `users/${data.id}/provider_appointments?page=${page}`;
            if (filters) {
                Object.keys(filters).forEach(key => url += `&${key}=${filters[key]}`);
            }

            return api(url.href, {
                method: 'GET',
            }, true)
        },
        patchClientAppointment: (id, body) => api(`users/${data.id}/client_appointments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/merge-patch+json',
            }
        }),
    };
};

export default useAppointmentService;
