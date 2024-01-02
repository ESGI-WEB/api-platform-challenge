import {Button} from "@codegouvfr/react-dsfr/Button";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default function SchedulesPeriodicForm({
    onChange = void 0,
}) {
    const {t} = useTranslation();
    const [periodicity, setPeriodicity] = useState({
        minutes: 30,
        start: '09:00',
        end: '17:00',
    });

    const defaultException = {
        start: '12:00',
        end: '13:00',
    };
    const [exceptions, setExceptions] = useState([defaultException]);
    const handleAddException = () => {
        setExceptions([...exceptions, defaultException]);
    }

    const handleRemoveException = (index) => {
        setExceptions(exceptions.filter((_, i) => i !== index));
    }

    const handleExceptionChange = (exception, field, value) => {
        exception[field] = value;
        setExceptions([...exceptions]);
    }

    const generateHours = () => {
        const hours = [];
        if (!periodicity.start || !periodicity.end || !periodicity.minutes) return;

        let currentTime = new Date(`2021-10-10T${periodicity.start}:00`);
        const endTime = new Date(`2021-10-10T${periodicity.end}:00`);
        const minutesToAdd = periodicity.minutes;
        while (currentTime <= endTime) {
            const hour = currentTime.toTimeString().split(' ')[0].slice(0, -3);
            const isException = exceptions.some((exception) => {
                const exceptionStart = new Date(`2021-10-10T${exception.start}:00`);
                const exceptionEnd = new Date(`2021-10-10T${exception.end}:00`);
                return currentTime >= exceptionStart && currentTime <= exceptionEnd;
            });
            if (!isException) {
                hours.push(hour);
            }
            currentTime = new Date(currentTime.getTime() + minutesToAdd*60000);
        }

        onChange(hours);
    }

    useEffect(() => {
        generateHours();
    }, [periodicity, exceptions]);

    return (
        <>
            <div className="flex gap-1 align-baseline">
                <p>{t('every')}</p>
                <input type="number" min="1" max={24*60} placeholder="1" value={periodicity.minutes}
                          onChange={(e) => setPeriodicity({...periodicity, minutes: +e.target.value})}/>
                <p>{t('minutes')}</p>
            </div>
            <div className="flex gap-1 align-baseline">
                <p>{t('from')}</p>
                <input type="time" value={periodicity.start}
                       onChange={(e) => setPeriodicity({...periodicity, start: e.target.value})}/>
                <p>{t('to')}</p>
                <input type="time" value={periodicity.end}
                       onChange={(e) => setPeriodicity({...periodicity, end: e.target.value})}/>
            </div>
            <div>
                <Button
                    type="button"
                    onClick={handleAddException}
                    priority="tertiary"
                >
                    + {t('exceptions')}
                </Button>
                {exceptions.map((exception, index) => (
                    <div key={index} className="flex gap-1 align-baseline">
                        <p>{t('from')}</p>
                        <input type="time" value={exception.start} onChange={(e) => handleExceptionChange(exception, 'start', e.target.value)}/>
                        <p>{t('to')}</p>
                        <input type="time" value={exception.end} onChange={(e) => handleExceptionChange(exception, 'end', e.target.value)}/>
                        <Button type="button" onClick={() => handleRemoveException(index)}>-</Button>
                    </div>
                ))}
            </div>
        </>
    );
}