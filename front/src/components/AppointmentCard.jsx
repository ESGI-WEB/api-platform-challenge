import AppointmentStatusBadge from "./AppointmentStatusBadge.jsx";
import {Card} from "@codegouvfr/react-dsfr/Card.js";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import {useTranslation} from "react-i18next";

export default function AppointmentCard({
    enlargeLink = false,
    appointment,
}) {
    const {t} = useTranslation();

    return (
        <Card
            background
            border
            enlargeLink={enlargeLink}
            linkProps={{
                to: '/appointment/' + appointment.id,
            }}
            start={<ul className="fr-badges-group">
                <li><Badge>{appointment.service.title}</Badge></li>
                <li>
                    <Badge severity="new">
                        {new Date(appointment.datetime).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Badge>
                </li>
            </ul>}
            desc={appointment.service.description}
            end={<ul className="fr-badges-group">
                <li><AppointmentStatusBadge status={appointment.status}/></li>
                {appointment.status === 'valid' && <li>
                    {t('appointment_with', {
                        name: appointment.provider.firstname + ' ' + appointment.provider.lastname
                    })}
                </li>}
            </ul>}
        />
    )
}