import {Button} from "@codegouvfr/react-dsfr/Button.js";
import Modal from "./Modal/Modal.jsx";
import LoadableButton from "./LoadableButton/LoadableButton.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import useOrganisationService from "../services/useOrganisationService.js";
import PageLoader from "./PageLoader/PageLoader.jsx";
import CalendarHeaderDate from "./Calendar/CalendarHeaderDate.jsx";
import CalendarItem from "./Calendar/CalendarItem.jsx";
import Calendar from "./Calendar/Calendar.jsx";
import ActionTile from "./ActionTile/ActionTile.jsx";
import useAppointmentService from "../services/useAppoitmentService.js";
import {AppointmentStatus} from "./AppointmentStatusBadge.jsx";

export default function RescheduleAppointment({
                                                  organisation,
                                                  provider,
                                                  service,
                                                  buttonComponent: ButtonComponent = Button,
                                                  priority = 'primary',
                                                  onSaved = void 0,
                                                  title = null,
                                                  cancelBaseAppointment = false,
                                                  baseAppointmentId = null,
                                              }) {
    const {t, i18n} = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const organisationService = useOrganisationService();
    const appointmentService = useAppointmentService();

    title = title || t('reschedule_appointment');

    useEffect(() => {
        setSlots([]);

        if (!isModalOpen) {
            return;
        }

        setIsLoading(true);
        organisationService.getProviderSlots(
            organisation.id,
            provider.id,
        ).then((slots) => {
            setSlots(slots);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [isModalOpen]);

    const validateAppointment = () => {
        setIsSaving(true);
        const data = {
            provider: `api/users/${provider.id}`,
            datetime: selectedSlot.datetime,
            service: `api/services/${service.id}`,
        };

        const promises = [appointmentService.create(data)];

        if (cancelBaseAppointment && baseAppointmentId) {
            promises.push(appointmentService.patchClientAppointment(baseAppointmentId, {status: AppointmentStatus.CANCELLED}));
        }

        Promise.all(promises).then(([appointment, cancelResponse]) => {
            onSaved(appointment, cancelResponse);
        }).finally(() => {
            setIsSaving(false);
            setIsModalOpen(false);
        });
    }

    return (
        <>
            <ButtonComponent
                onClick={() => setIsModalOpen(true)}
                priority={priority}
            >
                {title}
            </ButtonComponent>

            {isModalOpen &&
                <Modal
                    title={title}
                    onClose={() => setIsModalOpen(false)}
                >
                    <div className="flex flex-column gap-2">
                        <PageLoader className="fr-my-5v" isLoading={isLoading}/>

                        {slots.length > 0 &&
                            <>
                                <p>
                                    {t('reschedule_appointment_details', {
                                        name: provider.firstname + ' ' + provider.lastname,
                                        service_name: service.title,
                                    })}
                                </p>
                                <Calendar
                                    maxDisplayedColumns={4}
                                    calendarDateHeader={CalendarHeaderDate}
                                    calendarItem={CalendarItem}
                                    data={slots}
                                    onDateClick={setSelectedSlot}
                                ></Calendar>
                                {selectedSlot &&
                                    <ActionTile>
                                        <span>{t('youll_have_an_appointment_with')} {provider.firstname} {provider.lastname}</span>
                                        <span>
                                            {t('on_date', {
                                                date: new Date(selectedSlot.datetime).toLocaleDateString(i18n.language, {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric'
                                                    }
                                                )
                                            })}
                                        </span>
                                    </ActionTile>
                                }
                            </>
                        }

                        <div className="flex space-between">
                            <Button
                                onClick={() => setIsModalOpen(false)}
                                priority="tertiary no outline"
                            >
                                {t('back')}
                            </Button>

                            <LoadableButton
                                disabled={selectedSlot === null}
                                isLoading={isSaving}
                                onClick={() => validateAppointment()}
                            >
                                {t('take_an_appointment')}
                            </LoadableButton>
                        </div>
                    </div>
                </Modal>
            }
        </>
    );
}