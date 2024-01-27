import useApi from './useApi';

const useAppointmentReasonService = () => {
    const api = useApi();
    return {
        get: (id) => api(`services/${id}`, {
            method: 'GET',
        }),
        post: (body) => api(`services`, {
            method: 'POST',
            body: body,
        }),
        getServicesNames: () => api('names/services', {
            method: 'GET',
        }),
    };
};

export default useAppointmentReasonService;
