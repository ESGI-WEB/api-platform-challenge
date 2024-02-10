import AnswerFeedbackCard from "./AnswerFeedbackCard.jsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "@codegouvfr/react-dsfr/Button";
import Typography from "@mui/material/Typography";
import LoadableButton from "./LoadableButton/LoadableButton.jsx";

export default function AnswerFeedback({
    feedbacks = [],
    onSubmit = undefined,
    onDelete = undefined,
    isLoading = false,
    feedbackCardComponent: FeedbackCardComponent = AnswerFeedbackCard,
}) {
    const {t} = useTranslation();
    const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

    const [feedbacksState, setFeedbacksState] = useState(feedbacks);
    useEffect(() => {
        setFeedbacksState(feedbacks)
    }, [feedbacks]);

    const onNext = () => {
        if (currentFeedbackIndex === feedbacksState.length - 1) {
            onSubmit && onSubmit(feedbacksState);
        } else {
            setCurrentFeedbackIndex(currentFeedbackIndex + 1);
        }
    }

    const onValueChanged = (value) => {
        feedbacksState[currentFeedbackIndex].value = value;
        setFeedbacksState([...feedbacksState]);
    }

    return (
        <div>
            <div className="flex flex-row gap-2 space-between">
                {feedbacksState.length > 1 &&
                    <Typography className="fr-mb-2v" sx={{fontWeight: "bold"}}>
                        {t('question_x_on_y', {x: currentFeedbackIndex + 1, y: feedbacksState.length})}
                    </Typography>
                }
                {onDelete &&
                    <i className="fr-icon-delete-fill pointer" onClick={() => onDelete(feedbacksState[currentFeedbackIndex])}/>
                }
            </div>
            <FeedbackCardComponent
                {...feedbacksState[currentFeedbackIndex]}
                onValueChanged={onValueChanged}
            />
            <div className="flex flex-row gap-2 space-between fr-mt-2v">
                {currentFeedbackIndex > 0 &&
                    <Button
                        variant="contained"
                        priority="secondary"
                        disabled={currentFeedbackIndex === 0}
                        onClick={() => setCurrentFeedbackIndex(currentFeedbackIndex - 1)}
                    >
                        {t('previous_question')}
                    </Button>
                }
                <LoadableButton
                    variant="contained"
                    priority="primary"
                    disabled={feedbacksState[currentFeedbackIndex].isMandatory && !feedbacksState[currentFeedbackIndex].value}
                    onClick={onNext}
                    isLoading={isLoading}
                >
                    {currentFeedbackIndex === feedbacksState.length - 1 ? t('submit') : t('next_question')}
                </LoadableButton>
            </div>
        </div>
    );

}