import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useTranslation} from "react-i18next";

export default function OrganisationSelect({
    organisations,
    onChange = void 0,
    value = '',
}) {
    const {t} = useTranslation();

    return (
        <>
            <InputLabel>{t('choose_a_police_station')}</InputLabel>
            <FormControl fullWidth>
                <Select
                    value={value}
                    onChange={onChange}
                    renderValue={(value) => value.name ?? ''}
                >
                    {organisations.map((organisation) => (
                        <MenuItem value={organisation} key={organisation.id}>{organisation.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}