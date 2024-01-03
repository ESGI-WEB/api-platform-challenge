import Badge from "@codegouvfr/react-dsfr/Badge.js";
import {useState} from "react";

export default function PlanningItem({
    text,
    onClick = void 0,
    severity = undefined,
    noIcon = true,
    disabled = false,
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Badge
            noIcon={noIcon}
            severity={severity}
            className={!disabled && onClick ? 'pointer' : ''}
            onClick={!disabled && onClick ? onClick : undefined}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => !disabled && setIsHovered(false)}
        >
            {!isHovered ? text : <i className="fr-icon-delete-bin-line"/>}
        </Badge>
    );
}