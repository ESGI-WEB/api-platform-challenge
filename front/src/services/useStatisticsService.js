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
        getMaxOrganisations: () => api(`max_organisations`, {
            method: 'GET',
        }),
        getAppointmentsPerDay: () => api(`appointments_per_day`, {
            method: 'GET',
        }),
        getLastFeedback: () => api(`last_feedbacks`, {
            method: 'GET',
        }),
    };
};

export default useStatisticsService;
