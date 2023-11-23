import useApi from './useApi';
import useAuth from "../auth/useAuth.js";

const useOrganisationService = () => {
  const api = useApi();
  const {data} = useAuth();
  return {
    organisations: () => api('organisations', {
      method: 'GET',
    }),

    organisation: (name, latitude, longitude) => api('organisations', {
      method: 'POST',
      body: {name, latitude, longitude},
    })
  };
};

export default useOrganisationService;
