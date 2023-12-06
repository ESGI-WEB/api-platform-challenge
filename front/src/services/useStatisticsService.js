import useApi from './useApi';

const useStatisticsService = () => {
    const api = useApi();
    return {
        appointments_count: () => api(`appointments_count`, {
            method: 'GET',
        }),
        getCoordinatesFromAddress: (address, limit = 5) => fetch(
            `http://api-adresse.data.gouv.fr/search/?q=${address}&limit=${limit}`
        ).then(response => response.json()),
    };
};

export default useStatisticsService;
