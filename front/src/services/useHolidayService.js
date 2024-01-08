import useApi from './useApi';

const useHolidayService = () => {
    const api = useApi();
    return {
        post: (body) => api(`holidays`, {
            method: 'POST',
            body,
        }),
        delete: (id) => api(`holidays/${id}`, {
            method: 'DELETE',
        }),
    };
};

export default useHolidayService;
