import useApi from './useApi';

const useAppointmentService = () => {
    const api = useApi();
    return {
        create: (appointment) => api('appointments', {
            method: 'POST',
            body: JSON.stringify(appointment),
        }),
    };
};

export default useAppointmentService;
