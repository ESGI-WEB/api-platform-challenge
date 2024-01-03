import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import {useTranslation} from "react-i18next";
import OrganisationSelect from "./OrganisationSelect.jsx";
import {useState} from "react";
import LoadableButton from "./LoadableButton/LoadableButton.jsx";
import useHolidayService from "../services/useHolidayService.js";
import useAuth from "../auth/useAuth.js";
import Typography from "@mui/material/Typography";

export default function HolidaysCardForm({
    employeeId,
    style = {},
    organisations = [],
    onNewHoliday = void 0
}) {
    const {t} = useTranslation();
    const [station, setStation] = useState(organisations[0]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);
    const holidayService = useHolidayService();

    const onSubmitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrored(false);
        holidayService.post({
            organisation: `/api/organisations/${station.id}`,
            provider: `/api/users/${employeeId}`,
            datetimeStart: new Date(from),
            datetimeEnd: new Date(to),
        }).then(() => {
            setFrom('');
            setTo('');
            onNewHoliday();
        }).catch(() => {
            setErrored(true);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <Card variant="outlined" sx={style}>
            <CardContent>
                <form onSubmit={onSubmitForm} className="flex gap-2 flex-column">
                    <Divider>
                        {t('add_holiday')}
                    </Divider>
                    <OrganisationSelect organisations={organisations} value={station} onChange={(e) => setStation(e.target.value)}/>
                    <div className="flex flex-row gap-2 align-baseline">
                        <label>{t('from')}</label>
                        <input type="datetime-local" value={from}
                               onChange={(e) => setFrom(e.target.value)}/>
                    </div>
                    <div className="flex flex-row gap-2 align-baseline">
                        <label>{t('to')}</label>
                        <input type="datetime-local" value={to}
                               onChange={(e) => setTo(e.target.value)}/>
                    </div>
                    <LoadableButton isLoading={loading} type="submit" disabled={!station || !from || !to}>
                        {t('add')}
                    </LoadableButton>
                    {errored && <Typography>{t('invalid_form')}</Typography>}
                </form>
            </CardContent>
        </Card>
    )
}