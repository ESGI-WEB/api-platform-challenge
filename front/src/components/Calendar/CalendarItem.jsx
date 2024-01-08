import Badge from "@codegouvfr/react-dsfr/Badge.js";

export default function CalendarItem({
    text,
    onClick = void 0,
    severity = undefined,
    noIcon = true,
    disabled = false,
}) {
    return (
        <Badge
            noIcon={noIcon}
            severity={severity}
            className={!disabled && onClick ? 'pointer' : ''}
            onClick={!disabled && onClick ? onClick : undefined}
        >
            {text}
        </Badge>
    );
}