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
        getClientAppointment: (id) => api(`users/${data.id}/client_appointments/${id}`),
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
