import useApi from './useApi';

const useScheduleService = () => {
    const api = useApi();
    return {
        patch: (id, body) => api(`schedules/${id}`, {
            method: 'PATCH',
            body,
        }),
        post: (body) => api(`schedules`, {
            method: 'POST',
            body,
        }),
        delete: (id) => api(`schedules/${id}`, {
            method: 'DELETE',
        }),
    };
};

export default useScheduleService;
