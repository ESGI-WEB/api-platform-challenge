import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import FeedbacksTable from "../components/Table/FeedbacksTable.jsx";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import useFeedbackService from "../services/useFeedbackService.js";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";

export default function FeedbackAnswers() {
    const {t} = useTranslation();
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const feedbackService = useFeedbackService();

    useEffect(() => {
        setIsErrored(false);
        feedbackService.getFeedbacksAnswers()
            .then(setAnswers)
            .catch(() => setIsErrored(true))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Container>
            <Typography variant="h3" component="h1" gutterBottom>
                {t('feedbacks')}
            </Typography>

            <PageLoader isLoading={loading}/>
            {isErrored && <InPageAlert alert={{
                severity: AlertSeverity.ERROR,
                closable: false
            }}/>}
            {answers.length === 0 && !loading && <p>{t('no_feedbacks')}</p>}

            {answers.length > 0 && <FeedbacksTable answers={answers}/>}
        </Container>
    );
}