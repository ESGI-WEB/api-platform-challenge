import useApi from './useApi';

const useStatisticsService = () => {
    const api = useApi();
    return {
        getAppointmentsCount: () => api(`statistics/appointments_count`, {
            method: 'GET',
        }),
        getMaxAppointmentSlot: () => api(`statistics/max_appointment_slot`, {
            method: 'GET',
        }),
        getMostPopularSlotByHours: () => api(`statistics/most_popular_slot_by_hours`, {
            method: 'GET',
        }),
        getLastAppointments: () => api(`statistics/last_appointments`, {
            method: 'GET',
        }),
        getMaxOrganisations: () => api(`statistics/max_organisations`, {
            method: 'GET',
        }),
        getAppointmentsPerDay: () => api(`statistics/appointments_per_day`, {
            method: 'GET',
        }),
        getLastFeedback: () => api(`statistics/last_feedbacks`, {
            method: 'GET',
        }),
    };
};

export default useStatisticsService;
