import useApi from './useApi';

const useOrganisationService = () => {
    const api = useApi();
    return {
        getSlots: (organisation_id) => api(`organisations/${organisation_id}/available-slots`, {
            method: 'GET',
        })
    };
};

export default useOrganisationService;
