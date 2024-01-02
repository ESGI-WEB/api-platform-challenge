import {Tab, Tabs} from "@mui/material";
import {useState} from "react";
import SchedulesPeriodicForm from "./SchedulesPeriodicForm.jsx";
import SchedulesManualForm from "./SchedulesManualForm.jsx";
import {useTranslation} from "react-i18next";
import Box from "@mui/material/Box";
import PlanningItem from "./Calendar/PlanningItem.jsx";
import CalendarItem from "./Calendar/CalendarItem.jsx";
import Typography from "@mui/material/Typography";
import LoadableButton from "./LoadableButton/LoadableButton.jsx";
import OrganisationSelect from "./OrganisationSelect.jsx";

export default function SchedulesForm({
    organisations,
    onSubmit = void 0,
    unavailabilities = [],
    maxHoursShown = 20,
}) {
    const [tabSelected, setTabSelected] = useState(0);
    const [station, setStation] = useState(organisations[0]);
    const {t} = useTranslation();
    const [hours, setHours] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSelectStation = (e) => {
        setStation(e.target.value);
    }

    const handleRemoveHour = (hour) => {
        setHours(hours.filter((h) => h !== hour));
    }

    const setHoursOrdered = (hours) => {
        // filter hours in unavailable hours
        hours = hours.filter((hour) => !unavailabilities.includes(hour));

        // remove duplicates and order
        setHours([...new Set(hours)].sort());
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const submit = onSubmit({hours, organisation: station});
        if (submit instanceof Promise) {
            setLoading(true);
            submit.finally(() => {
                setLoading(false);
            });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <OrganisationSelect organisations={organisations} onChange={handleSelectStation} value={station}/>

            <Tabs value={tabSelected} onChange={(e, value) => setTabSelected(value)}>
                <Tab label={t('periodic_add')}/>
                <Tab label={t('manual_add')}/>
            </Tabs>

            <Box sx={{padding: 3}}>
                {tabSelected === 0 && <SchedulesPeriodicForm onChange={setHoursOrdered}/>}
                {tabSelected === 1 && <SchedulesManualForm onChange={hour => setHoursOrdered([...hours, hour])}/>}
            </Box>

            <div className="flex flex-column gap-2">
                <div className="flex flex-wrap gap-1">
                    <Typography>{t('hours_to_add')}</Typography>
                    {hours.length > 0 && <i className="fr-icon-delete-bin-line pointer" onClick={() => setHours([])}/>}
                </div>
                {hours.length > 0 &&
                    <div className="flex flex-wrap gap-1">
                        {hours.slice(0, maxHoursShown).map((hour) => (
                            <PlanningItem key={hour} text={hour} severity='info' onClick={() => handleRemoveHour(hour)}/>
                        ))}
                        {hours.length > maxHoursShown &&
                            <CalendarItem text={'+ ' + (hours.length - maxHoursShown)} severity='info'/>
                        }
                    </div>
                }

                <LoadableButton isLoading={loading} type='submit'>{t('save')}</LoadableButton>

                {unavailabilities.length > 0 &&
                    <>
                        <Typography>{t('unavailabilities')}</Typography>
                        <div className="flex flex-wrap gap-1">
                            {unavailabilities.map((unavailability) => (
                                <CalendarItem key={unavailability} text={unavailability} severity='warning'/>
                            ))}
                        </div>
                    </>
                }
            </div>
        </form>
    );
}