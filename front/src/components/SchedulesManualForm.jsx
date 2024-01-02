import TextField from "@mui/material/TextField";
import {useState} from "react";
import {Button} from "@codegouvfr/react-dsfr/Button";
import {useTranslation} from "react-i18next";

export default function SchedulesManualForm({
    onChange = void 0,
}) {
    const [value, setValue] = useState('');
    const {t} = useTranslation();

    const addValue = () => {
        if (!value) return;
        setValue('');
        onChange(value);
    }

    return (
        <div className="flex flex-wrap gap-2 align-center">
            <TextField
                id="hour"
                type="time"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

            <Button
                onClick={addValue}
                type="button"
            >
                {t('add')}
            </Button>
        </div>
    );
}