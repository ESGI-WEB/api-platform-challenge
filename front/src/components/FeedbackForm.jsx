import Input from "@codegouvfr/react-dsfr/Input.js";
import {useTranslation} from "react-i18next";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch.js";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useState} from "react";
import LoadableButton from "./LoadableButton/LoadableButton.jsx";

export default function FeedbackForm({
    onSave = void 0,
    isSaving = false,
}) {
    const {t} = useTranslation();
    const [type, setType] = useState('mark');
    const [isMandatory, setIsMandatory] = useState(false);
    const [question, setQuestion] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        onSave({
            type,
            isMandatory,
            question,
        });
    }

    return (
        <form className="flex flex-column gap-1" onSubmit={onSubmit}>
            <div className="flex flex-row gap-2">
                <div>
                    <InputLabel>{t('feedback_type')}</InputLabel>
                    <FormControl>
                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value='mark'>{t('mark')}</MenuItem>
                            <MenuItem value='comment'>{t('comment')}</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="full-width">
                    <Input
                        fullWidth
                        label={t('feedback_question')}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>
            </div>

            <ToggleSwitch
                label={t('is_feedback_mandatory')}
                defaultChecked={false}
                onChange={(checked) => setIsMandatory(checked)}
            />

            <LoadableButton
                type="submit"
                loading={isSaving}
                variant="contained"
                color="primary"
                disabled={!question || !type || isSaving}
            >
                {t('save')}
            </LoadableButton>

        </form>
    );
}