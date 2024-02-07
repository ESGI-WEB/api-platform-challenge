import {useLocation, useNavigate, useParams} from "react-router-dom";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import {useEffect, useState} from "react";
import useAppointmentService from "../services/useAppoitmentService.js";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import {useTranslation} from "react-i18next";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import OrganisationLocation from "../components/OrganisationLocation.jsx";
import AppointmentStatusBadge, {AppointmentStatus} from "../components/AppointmentStatusBadge.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import RescheduleAppointment from "../components/RescheduleAppointment.jsx";
import AnswerFeedback from "../components/AnswerFeedback.jsx";
import useFeedbackService from "../services/useFeedbackService.js";

export default function Appointment() {
    const {appointmentId} = useParams();
    const {search} = useLocation();
    const params = new URLSearchParams(search);
    const display = params.get('display');
    const [isLoading, setIsLoading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
    const [pageAlert, setPageAlert] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const appointmentService = useAppointmentService();
    const feedbackService = useFeedbackService();
    const navigate = useNavigate();
    const location = useLocation();
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
                setHasSubmittedFeedback(appointment.answers?.length > 0);
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

    const onNewAppointmentSaved = (appointment) => {
        navigate(`/appointment/${appointment.id}?display=success`);
    }

    useEffect(() => {
        if (display === 'success') {
            setPageAlert(successCreatedAppointementAlert);
        }
        loadAppointment();
    }, [location]);

    const submitFeedback = (feedbacks) => {
        setIsSubmittingFeedback(true);
        const answers = feedbacks
            .filter(fb => fb.value !== undefined && fb.value !== null && fb.value !== '')
            .map(fb => ({feedback: fb.id, value: `${fb.value}`}));

        feedbackService.postFeedbacksForAppointment(appointmentId, answers)
            .finally(() => {
                setHasSubmittedFeedback(true);
                setIsSubmittingFeedback(false);
            });
    }

    return (
        <>
            <h1>{t('your_appointment')}</h1>
            {pageAlert && <InPageAlert
                noDescription={pageAlert.noDescription}
                alert={pageAlert}
            />}
            <PageLoader isLoading={isLoading}/>

            {appointment && !isLoading && <>
                {appointment.status === 'valid' && new Date(appointment.datetime) < new Date() &&
                    <div className="fr-mb-5v">
                        <h4><i className="ri-user-smile-line"></i> {t('we_need_your_opinion')}</h4>
                        <p>{t('your_opinion_count_and_help_us')}</p>
                        {!hasSubmittedFeedback && <AnswerFeedback feedbacks={appointment.service.feedback} onSubmit={submitFeedback} isLoading={isSubmittingFeedback}/>}
                        {hasSubmittedFeedback &&
                            <InPageAlert alert={{
                                    description: t('feedback_submitted'),
                                    severity: AlertSeverity.SUCCESS,
                                    closable: false
                            }}/>
                        }
                    </div>
                }

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

                {appointment.status === 'valid' && new Date(appointment.datetime) >= new Date() && <div>
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

                <div className="fr-mt-5v flex flex-wrap gap-2">
                    {appointment.status === 'valid' && new Date(appointment.datetime) > new Date() && <>
                        <RescheduleAppointment
                            title={t('shift_appointment')}
                            organisation={appointment.service.organisation}
                            service={appointment.service}
                            provider={appointment.provider}
                            onSaved={(appointment) => onNewAppointmentSaved(appointment)}
                            cancelBaseAppointment={true}
                            baseAppointmentId={appointment.id}
                        />
                        <LoadableButton isLoading={isCancelling} onClick={cancelAppointment} priority="secondary">
                            {t('cancel_appointment')}
                        </LoadableButton>
                    </>}
                    {(new Date(appointment.datetime) < new Date() || appointment.status !== AppointmentStatus.VALID) &&
                        <RescheduleAppointment
                            priority="secondary"
                            organisation={appointment.service.organisation}
                            service={appointment.service}
                            provider={appointment.provider}
                            onSaved={(appointment) => onNewAppointmentSaved(appointment)}
                        />
                    }
                </div>
            </>}
        </>
    );
}
