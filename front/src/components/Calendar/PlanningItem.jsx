import Badge from "@codegouvfr/react-dsfr/Badge.js";
import {useState} from "react";

export default function PlanningItem({
    text,
    onClick = void 0,
    severity = undefined,
    noIcon = true
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Badge
            noIcon={noIcon}
            severity={severity}
            className={onClick ? 'pointer' : ''}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!isHovered ? text : <i className="fr-icon-delete-bin-line"/>}
        </Badge>
    );
}