import Input from "@codegouvfr/react-dsfr/Input.js";
import {useTranslation} from "react-i18next";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch.js";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useState} from "react";
import LoadableButton from "./LoadableButton/LoadableButton.jsx";
import TextField from "@mui/material/TextField";

export default function FeedbackForm({
    onSubmit = void 0,
    isSaving = false,
}) {
    const {t} = useTranslation();
    const [type, setType] = useState('mark');
    const [isMandatory, setIsMandatory] = useState(false);
    const [question, setQuestion] = useState('');

    const onSubmitForm = (e) => {
        e.preventDefault();

        onSubmit({
            type,
            isMandatory,
            question,
        });

        setType('mark');
        setIsMandatory(false);
        setQuestion('');
    }

    return (
        <form className="flex flex-column gap-1" onSubmit={onSubmitForm}>
            <div className="flex flex-row gap-2">
                <FormControl
                    sx={{
                        minWidth: '100px',
                    }}
                >
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value='mark'>{t('mark')}</MenuItem>
                        <MenuItem value='text'>{t('text')}</MenuItem>
                    </Select>
                </FormControl>
                <div className="full-width">
                    <TextField
                        fullWidth
                        label={t('feedback_question')}
                        onChange={(e) => setQuestion(e.target.value)}
                        value={question}
                    />
                </div>
            </div>

            <ToggleSwitch
                label={t('is_feedback_mandatory')}
                onChange={(checked) => setIsMandatory(checked)}
                checked={isMandatory}
            />

            <LoadableButton
                type="submit"
                isLoading={isSaving}
                variant="contained"
                color="primary"
                disabled={!question || !type || isSaving}
            >
                {t('save')}
            </LoadableButton>

        </form>
    );
}