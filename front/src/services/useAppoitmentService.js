import useApi from './useApi';
import useAuth from "../auth/useAuth.js";

const useAppointmentService = () => {
    const api = useApi();
    const {data} = useAuth();
    return {
        create: (appointment) => api('appointments', {
            method: 'POST',
            body: appointment,
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
        exportClientAppointments: (filters = null) => {
            let url = `users/${data.id}/client_appointments?pagination=false`;
            if (filters) {
                Object.keys(filters).forEach(key => url += `&${key}=${filters[key]}`);
            }

            return api(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/csv',
                }
            }, true)
        },
        getProviderAppointments: (page, filters = null) => {
            let url = `users/${data.id}/employee_appointments?page=${page}`;
            if (filters) {
                Object.keys(filters).forEach(key => url += `&${key}=${filters[key]}`);
            }

            return api(url, {
                method: 'GET',
            }, true)
        },
        exportProviderAppointments: (filters = null) => {
            let url = `users/${data.id}/employee_appointments?pagination=false`;
            if (filters) {
                Object.keys(filters).forEach(key => url += `&${key}=${filters[key]}`);
            }

            return api(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/csv',
                }
            }, true)
        },
        getOrganisationAppointments: (page, organisationId, filters = null) => {
            let url = `appointments/organisation/${organisationId}?page=${page}`;
            if (filters) {
                Object.keys(filters).forEach(key => url += `&${key}=${filters[key]}`);
            }

            return api(url, {
                method: 'GET',
            }, true)
        },
        exportOrganisationAppointments: (organisationId, filters = null) => {
            let url = `appointments/organisation/${organisationId}?pagination=false`;
            if (filters) {
                Object.keys(filters).forEach(key => url += `&${key}=${filters[key]}`);
            }

            return api(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/csv',
                }
            }, true)
        },
        patchClientAppointment: (id, body) => api(`users/${data.id}/client_appointments/${id}`, {
            method: 'PATCH',
            body: body,
            headers: {
                'Content-Type': 'application/merge-patch+json',
            }
        }),
    };
};

export default useAppointmentService;
