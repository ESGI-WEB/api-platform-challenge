import useApi from './useApi';
import useAuth from "../auth/useAuth.js";

const useOrganisationService = () => {
    const api = useApi();
    const {data} = useAuth();
    return {
        organisations: (page = 1) => api(`organisations?page=${page}`, {
            method: 'GET',
        }, true),
        providersOrganisations: (page = 1) => api(`users/${data.id}/organisations?page=${page}`, {
            method: 'GET',
        }, true),
        createOrganisation: (body) => api(`organisations`, {
            method: 'POST',
            body: body,
        }),
        getSlots: (organisation_id) => api(`organisations/${organisation_id}/available-slots`, {
            method: 'GET',
        }),
        getProviderSlots: (organisation_id, provider_id) => api(`organisations/${organisation_id}/providers/${provider_id}/available-slots`, {
            method: 'GET',
        }),
        get: (organisation_id) => api(`organisations/${organisation_id}`, {
            method: 'GET',
        }),
        getCoordinatesFromAddress: (address, limit = 5) => fetch(
            `http://api-adresse.data.gouv.fr/search/?q=${address}&limit=${limit}`
        ).then(response => response.json()),
    };
};

export default useOrganisationService;
