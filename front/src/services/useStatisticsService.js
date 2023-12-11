import useApi from './useApi';

const useStatisticsService = () => {
    const api = useApi();
    return {
        getAppointmentsCount: () => api(`appointments_count`, {
            method: 'GET',
        }),
        getMaxAppointmentSlot: () => api(`max_appointment_slot`, {
            method: 'GET',
        }),
        getLastAppointments: () => api(`last_appointments`, {
            method: 'GET',
        }),
    };
};

export default useStatisticsService;
