import {useLocation, useParams} from "react-router-dom";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import {useEffect, useState} from "react";
import useAppointmentService from "../services/useAppoitmentService.js";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import {useTranslation} from "react-i18next";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import OrganisationLocation from "../components/OrganisationLocation.jsx";
import AppointmentStatusBadge, {AppointmentStatus} from "../components/AppointmentStatusBadge.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";

export default function Appointment() {
    const {appointmentId} = useParams();
    const {search} = useLocation();
    const params = new URLSearchParams(search);
    const display = params.get('display');
    const [isLoading, setIsLoading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [pageAlert, setPageAlert] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const appointmentService = useAppointmentService();
    const {t, i18n} = useTranslation();
    const successCreatedAppointementAlert = {
        title: t('appointment_success_title'),
        severity: AlertSeverity.SUCCESS,
        noDescription: true,
    };
    const globalErrorAlert = {
        severity: AlertSeverity.ERROR
    };

    const loadAppointment = () => {
        setIsLoading(true);

        appointmentService.getClientAppointment(appointmentId)
            .then((appointment) => {
                setAppointment(appointment);
                setPageAlert(null);
            })
            .catch((e) => {
                console.error(e);
                setPageAlert(globalErrorAlert);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const cancelAppointment = () => {
        setIsCancelling(true);

        appointmentService.patchClientAppointment(appointmentId, {status: AppointmentStatus.CANCELLED})
            .then((appointment) => {
                setAppointment(appointment);
                window.scrollTo(0, 0);
            })
            .catch((e) => {
                console.error(e);
                setPageAlert(globalErrorAlert);
            })
            .finally(() => {
                setIsCancelling(false);
            });
    }

    useEffect(() => {
        if (display === 'success') {
            setPageAlert(successCreatedAppointementAlert);
        }
        !appointment && loadAppointment();
    }, []);

    return (
        <>
            <h1>{t('your_appointment')}</h1>
            {pageAlert && <InPageAlert
                noDescription={pageAlert.noDescription}
                alert={pageAlert}
            />}
            <PageLoader isLoading={isLoading}/>

            {appointment && <>
                <h4><i className="ri-chat-3-line"></i> {t('your_asked_service')}</h4>
                <div className="flex flex-wrap-reverse gap-1 fr-mb-5v">
                    <Badge>{appointment.service.title}</Badge>
                    <Badge noIcon severity="new">
                        <span>
                            {t('appointment_date', {
                                date: new Date(appointment.datetime).toLocaleDateString(i18n.language, {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                            })}
                        </span>
                    </Badge>
                    <AppointmentStatusBadge status={appointment.status}/>
                </div>
                <p>{appointment.service.description}</p>
                <p>
                    {t('appointment_with', {
                        name: appointment.provider.firstname + ' ' + appointment.provider.lastname
                    })}
                </p>

                {appointment.status === 'valid' && <div>
                    <h4><i className="ri-file-text-line"></i> {t('the_appointment_day')}</h4>
                    <p>
                        {t('appointment_day_needed_documents')}
                    </p>
                    <ul>
                        <li>{t('needed_valid_id_card')}</li>
                        <li>{t('needed_documents')}</li>
                        <li>{t('needed_residency_proof')}</li>
                    </ul>
                    <p>{t('dont_hestitate_to_contact_us')}</p>
                </div>}


                <h4><i className="ri-map-pin-2-line"></i> {t('police_station_address')}</h4>
                <OrganisationLocation organisation={appointment.service.organisation}/>

                <div className="fr-mt-5v">
                    {appointment.status === 'valid' &&
                        <LoadableButton isLoading={isCancelling} onClick={cancelAppointment} priority="secondary">
                            {t('cancel_appointment')}
                        </LoadableButton>
                    }
                </div>
            </>}
        </>
    );
};
