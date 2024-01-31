import Modal from "./Modal/Modal.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import useFeedbackService from "../services/useFeedbackService.js";
import PageLoader from "./PageLoader/PageLoader.jsx";
import InPageAlert from "./InPageAlert.jsx";
import FeedbackForm from "./FeedbackForm.jsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function EditServiceFeedbackModal({
    serviceId,
    setIsModalOpen = void 0,
}) {
    const {t} = useTranslation();
    const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
    const [isErrored, setIsErrored] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const feedbackSrv = useFeedbackService();

    useEffect(() => {
        setFetchingFeedbacks(true);
        setIsErrored(false);
        feedbackSrv.getFromService(serviceId)
            .then(setFeedbacks)
            .catch(() => setIsErrored(true))
            .finally(() => setFetchingFeedbacks(false));
    }, [serviceId]);


    const onSave = (data) => {
        setIsSaving(true);
        setIsErrored(false);
        feedbackSrv.addServiceFeedback(serviceId, data)
            .then((newFeedback) => setFeedbacks([...feedbacks, newFeedback]))
            .catch(() => setIsErrored(true))
            .finally(() => setIsSaving(false));
    }

    return (
        <Modal
            title={t('feedback_form')}
            onClose={() => setIsModalOpen(false)}
        >
            <div className="flex flex-column gap-2">
                <PageLoader isLoading={fetchingFeedbacks}/>
                {isErrored && <InPageAlert alert={{severity: 'error', closable: false}}/>}
                {!fetchingFeedbacks &&
                    <>
                        <Card variant="outlined">
                            <CardContent>
                                <FeedbackForm onSave={onSave} loading={isSaving}/>
                            </CardContent>
                        </Card>
                    </>
                }
            </div>
        </Modal>
    );
}