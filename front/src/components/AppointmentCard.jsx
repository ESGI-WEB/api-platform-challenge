import AppointmentStatusBadge from "./AppointmentStatusBadge.jsx";
import {Card} from "@codegouvfr/react-dsfr/Card.js";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import {useTranslation} from "react-i18next";

export default function AppointmentCard({
    enlargeLink = false,
    appointment,
}) {
    const {t, i18n} = useTranslation();

    return (
        <Card
            background
            border
            enlargeLink={enlargeLink}
            linkProps={{
                to: '/appointment/' + appointment.id,
            }}
            start={<ul className="fr-badges-group">
                <li>
                    <Badge severity="new">
                        {new Date(appointment.datetime).toLocaleDateString(i18n.language, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Badge>
                </li>
                <li>
                    <AppointmentStatusBadge status={appointment.status}/>
                </li>
            </ul>}
            desc={
                <div>
                    <div><span className="bold">{t("appointment_reason")}</span> {appointment.service.title}</div>
                    <div className="mt-1">
                        <div className="bold">{t("appointment_adress")}</div>
                        <div>{appointment.service.organisation.name}</div>
                        <div>{appointment.service.organisation.address}</div>
                        <div>{`${appointment.service.organisation.city} ${appointment.service.organisation.zipcode}`}</div>
                    </div>
                </div>
            }
            end={
                appointment.status === 'valid' && <div>
                    <span className="bold">{t('appointment_with')}</span> {appointment.provider.firstname + ' ' + appointment.provider.lastname}
                </div>}
        />
    )
}