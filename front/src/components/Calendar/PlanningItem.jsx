import Badge from "@codegouvfr/react-dsfr/Badge.js";
import {useState} from "react";
import {Tooltip} from "@mui/material";

export default function PlanningItem({
    text,
    onClick = void 0,
    severity = undefined,
    noIcon = true,
    disabled = false,
    hoverText = null,
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Tooltip title={hoverText}>
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
        </Tooltip>
    );
}