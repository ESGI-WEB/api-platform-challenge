import Badge from "@codegouvfr/react-dsfr/Badge.js";
import {useTranslation} from "react-i18next";

export const AppointmentStatus = {
    VALID: 'valid',
    CANCELLED: 'cancelled',
}

export default function AppointmentStatusBadge({status}) {
    const {t} = useTranslation();

    const statusMapping = {
        [AppointmentStatus.VALID]: {
            severity: 'success',
            text: t('appointment_status_valid'),
        },
        [AppointmentStatus.CANCELLED]: {
            severity: 'error',
            text: t('appointment_status_cancelled'),
        }
    }


    return (
        <Badge
            severity={statusMapping[status].severity}
        >{statusMapping[status].text}</Badge>
    )
};
