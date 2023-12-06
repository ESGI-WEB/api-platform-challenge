import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import useAppointmentService from "../services/useAppoitmentService.js";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import {useTranslation} from "react-i18next";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import AppointmentStatusBadge, {AppointmentStatus} from "../components/AppointmentStatusBadge.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import useAuth, {Roles} from "../auth/useAuth.js";
import CallOut from "@codegouvfr/react-dsfr/CallOut.js";
import {Card} from "@codegouvfr/react-dsfr/Card";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

export default function Appointments() {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const auth = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const page = useRef(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const appointmentService = useAppointmentService();
    const isUserProvider = auth.data.roles.includes(Roles.PROVIDER);
    const filters = useRef(['future']);

    const loadAppointments = () => {
        setIsLoading(true);
        const parsedFilters = {
            'order[datetime]': 'asc',
        };

        filters.current.forEach((filter) => {
            switch (filter) {
                case 'future':
                    parsedFilters['datetime[after]'] = new Date().toISOString();
                    break;
                case 'valid':
                    parsedFilters['status'] = AppointmentStatus.VALID;
                    break;
                default:
                    break;
            }
        });

        const promise = isUserProvider ?
            appointmentService.getProviderAppointments(page.current, parsedFilters) :
            appointmentService.getClientAppointments(page.current, parsedFilters)

        promise.then((response) => {
            if (page.current === 1) {
                setAppointments(response['hydra:member']);
            } else {
                setAppointments([...appointments, ...response['hydra:member']]);
            }

            page.current++;
            setHasNextPage(!!response['hydra:view']['hydra:next']);
        })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const handleFilters = (event, newFilters) => {
        console.log(newFilters)
        page.current = 1;
        filters.current = newFilters;
        setAppointments([]);
        setHasNextPage(true);
        loadAppointments();
    }

    useEffect(() => {
        appointments.length <= 0 && loadAppointments();
    }, []);

    return (
        <>
            <h1>{t('your_appointments')}</h1>
            <ToggleButtonGroup
                className="fr-mb-5v"
                value={filters.current}
                onChange={handleFilters}
                disabled={isLoading}
            >
                <ToggleButton value="future">
                    {t('only_future_appointments')}
                </ToggleButton>
                <ToggleButton value="valid">
                    {t('only_valid_appointments')}
                </ToggleButton>
            </ToggleButtonGroup>

            {appointments.map((appointment) =>
                <div key={appointment.id} className="fr-mb-5v">
                    <Card
                        background
                        border
                        enlargeLink={!isUserProvider}
                        linkProps={{
                            to: '/appointment/' + appointment.id,
                        }}
                        start={<ul className="fr-badges-group">
                            <li><Badge>{appointment.service.title}</Badge></li>
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
                </div>
            )}

            {appointments.length <= 0 && !isLoading &&
                <CallOut
                    buttonProps={{
                        children: t('back_to_home'),
                        onClick: () => navigate('/'),
                    }}
                    iconId="ri-calendar-close-fill"
                    title={t('no_appointment_yet')}
                >
                    {t('no_appointments_details')}
                </CallOut>
            }

            {appointments.length > 0 && hasNextPage &&
                <LoadableButton isLoading={isLoading} onClick={loadAppointments}>{t('load_more')}</LoadableButton>}
            {appointments.length <= 0 && <PageLoader isLoading={isLoading}/>}
        </>
    );
}
