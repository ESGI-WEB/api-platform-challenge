import {useTranslation} from "react-i18next";

export default function CalendarHeaderDate({
    date,
}) {
    const {i18n} = useTranslation();

    return (
        <>
            <p className="margin-0">{date.toLocaleDateString(i18n.language, {weekday: 'long'})}</p>
            <p className="fr-mb-0">
                <small>
                    {date.toLocaleDateString(i18n.language, {
                        day: 'numeric',
                        month: 'short'
                    })}
                </small>
            </p>
        </>
    );
}