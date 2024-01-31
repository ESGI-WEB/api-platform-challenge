import useApi from './useApi';

const useFeedbackService = () => {
    const api = useApi();

    return {
        getFromService: (serviceId) => api(`services/${serviceId}/feedback`, {
            method: 'GET',
        }),
        addServiceFeedback: (serviceId, feedback) => api(`feedback`, {
            method: 'POST',
            body: {
                ...feedback,
                service: 'api/services/' + serviceId,
            },
        }),
    };
};

export default useFeedbackService;
