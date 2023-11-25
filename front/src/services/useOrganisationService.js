import useApi from './useApi';

const useOrganisationService = () => {
    const api = useApi();
    return {
        getSlots: (organisation_id) => api(`organisations/${organisation_id}/available-slots`, {
            method: 'GET',
        }),
        get: (organisation_id) => api(`organisations/${organisation_id}`, {
            method: 'GET',
        }),
    };
};

export default useOrganisationService;
