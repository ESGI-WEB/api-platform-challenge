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
    };
};

export default useUserService;
