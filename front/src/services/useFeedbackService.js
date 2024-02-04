import useApi from './useApi';

const useFeedbackService = () => {
    const api = useApi();

    return {
        getFromService: (serviceId) => api(`services/${serviceId}/feedbacks`, {
            method: 'GET',
        }),
        getFeedbacksAnswers: () => api(`answers-detailed`, {
            method: 'GET',
        }),
        addServiceFeedback: (serviceId, feedback) => api(`feedback`, {
            method: 'POST',
            body: {
                ...feedback,
                service: 'api/services/' + serviceId,
            },
        }),
        deleteFeedback: (feedbackId) => api(`feedback/${feedbackId}`, {
            method: 'DELETE',
        }),
        postFeedbacksForAppointment: (appointmentId, answers) => {
            const promises = answers.map((answer) => {
                return api(`answers`, {
                    method: 'POST',
                    body: {
                        answer: answer.value,
                        appointment: 'api/appointments/' + appointmentId,
                        feedback: 'api/feedback/' + answer.feedback,
                    },
                });
            });

            return Promise.all(promises);
        }
    };
};

export default useFeedbackService;
