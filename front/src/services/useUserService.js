import useApi from './useApi';

const useUserService = () => {
    const api = useApi();
    return {
        getProviderEmployees: (provider_id) => api(`users/${provider_id}/employees`, {
            method: 'GET',
        }),
        getUser: (user_id) => api(`users/${user_id}`, {
            method: 'GET',
        }),
        postUser: (body) => api(`users`, {
            method: 'POST',
            body: body,
        }),
        postProvider: (body) => api(`users/provider`, {
            method: 'POST',
            body: body,
        }),
        getProvidersToValidate: (page = 1) => api(`providers_to_validate?page=${page}`, {
            method: 'GET'
        }, true),
        patchUser: (id, body) => api(`users/${id}`, {
            method: 'PATCH',
            body: body,
            headers: {
                'Content-Type': 'application/merge-patch+json',
            }
        }),
    };
};

export default useUserService;
