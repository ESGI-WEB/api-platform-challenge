import useApi from './useApi';

const useAuthService = () => {
    const api = useApi();
    return {
        login: (email, password) => api('login', {
            method: 'POST',
            body: {email, password},
        })
    };
};

export default useAuthService;
