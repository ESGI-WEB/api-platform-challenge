import Badge from "@codegouvfr/react-dsfr/Badge.js";

export default function CalendarItem({
    text,
    onClick = void 0,
    severity = undefined,
    noIcon = true
}) {
    return (
        <Badge
            noIcon={noIcon}
            severity={severity}
            className={onClick ? 'pointer' : ''}
            onClick={onClick}
        >
            {text}
        </Badge>
    );
}