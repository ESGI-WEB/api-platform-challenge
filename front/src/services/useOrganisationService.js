import useApi from './useApi';
import useAuth from "../auth/useAuth.js";

const useOrganisationService = () => {
    const api = useApi();
    const {data} = useAuth();
    return {
        organisations: () => api('organisations', {
            method: 'GET',
        }),
        providersOrganisations: () => api(`users/${data.id}/organisations`, {
            method: 'GET',
        }),
        organisation: (name, latitude, longitude) => api('organisations', {
            method: 'POST',
            body: {name, latitude, longitude},
        }),
        getSlots: (organisation_id) => api(`organisations/${organisation_id}/available-slots`, {
            method: 'GET',
        }),
        get: (organisation_id) => api(`organisations/${organisation_id}`, {
            method: 'GET',
        }),
    };
};

export default useOrganisationService;
