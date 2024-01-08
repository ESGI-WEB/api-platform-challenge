import {useTranslation} from "react-i18next";

export default function PlanningHeaderDate({
    date,
}) {
    const {i18n} = useTranslation();

    return (
        <>
            <p className="margin-0">{date.toLocaleDateString(i18n.language, {weekday: 'long'})}</p>
        </>
    );
}