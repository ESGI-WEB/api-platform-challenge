import Modal from "./Modal/Modal.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import useFeedbackService from "../services/useFeedbackService.js";
import PageLoader from "./PageLoader/PageLoader.jsx";
import InPageAlert from "./InPageAlert.jsx";
import FeedbackForm from "./FeedbackForm.jsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AnswerFeedback from "./AnswerFeedback.jsx";

export default function EditServiceFeedback({
    serviceId,
    setIsModalOpen = void 0,
    feedbackFrom: FeedbackFormComponent = FeedbackForm,
    container: ContainerComponent = Modal,
    answerFeedback: AnswerFeedbackComponent = AnswerFeedback,
}) {
    const {t} = useTranslation();
    const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const feedbackSrv = useFeedbackService();

    useEffect(() => {
        setFetchingFeedbacks(true);
        setError(null);
        feedbackSrv.getFromService(serviceId)
            .then(setFeedbacks)
            .catch(() => setError(t('error_fetching_feedbacks')))
            .finally(() => setFetchingFeedbacks(false));
    }, [serviceId]);

    const onSubmit = (data) => {
        setIsSaving(true);
        setError(null);
        feedbackSrv.addServiceFeedback(serviceId, data)
            .then((newFeedback) => setFeedbacks([...feedbacks, newFeedback]))
            .catch(() => setError(t('error_saving_feedback')))
            .finally(() => setIsSaving(false));
    }

    const onDeleteFeedback = (feedback) => {
        setIsSaving(true);
        setError(null);
        feedbackSrv.deleteFeedback(feedback.id)
            .then(() => setFeedbacks([...feedbacks.filter((f) => f.id !== feedback.id)]))
            .catch(() => setError(t('error_deleting_feedback')))
            .finally(() => setIsSaving(false));
    }

    return (
        <ContainerComponent
            title={t('feedback_form')}
            onClose={() => setIsModalOpen(false)}
        >
            <div className="flex flex-column gap-2">
                <PageLoader isLoading={fetchingFeedbacks}/>
                {error && <InPageAlert alert={{severity: 'error', closable: true, description: error}}/>}
                {!fetchingFeedbacks &&
                    <>
                        <Card variant="outlined">
                            <CardContent>
                                <FeedbackFormComponent onSubmit={onSubmit} isSaving={isSaving}/>
                            </CardContent>
                        </Card>
                    </>
                }
                {!fetchingFeedbacks && feedbacks.length > 0 &&
                    <>
                        <Typography>{t('feedback_form_visualisation')}</Typography>
                        <Card variant="outlined">
                            <CardContent>
                                <AnswerFeedbackComponent
                                    feedbacks={feedbacks}
                                    onDelete={onDeleteFeedback}
                                    isLoading={isSaving}
                                />
                            </CardContent>
                        </Card>
                    </>
                }
            </div>
        </ContainerComponent>
    );
}