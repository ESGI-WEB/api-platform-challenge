import {useTranslation} from "react-i18next";
import Badge from "@codegouvfr/react-dsfr/Badge.js";

export default function CalendarItem({
    date,
    onClick = void 0
}) {
    const {i18n} = useTranslation();

    return (
        <Badge noIcon
               severity="info"
               className="pointer"
               onClick={onClick}
        >
            {date.toLocaleTimeString(i18n.language, {hour: '2-digit', minute: '2-digit'})}
        </Badge>
    );
}