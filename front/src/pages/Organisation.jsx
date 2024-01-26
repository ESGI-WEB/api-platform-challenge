import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import useOrganisationService from "../services/useOrganisationService.js";
import 'leaflet/dist/leaflet.css';
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import Calendar from "../components/Calendar/Calendar.jsx";
import CallOut from "@codegouvfr/react-dsfr/CallOut.js";
import Notice from "@codegouvfr/react-dsfr/Notice.js";
import Button from "@codegouvfr/react-dsfr/Button.js";
import ActionTile from "../components/ActionTile/ActionTile.jsx";
import useAppointmentService from "../services/useAppoitmentService.js";
import Modal from "../components/Modal/Modal.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import {useTranslation} from "react-i18next";
import OrganisationLocation from "../components/OrganisationLocation.jsx";
import CreateServiceModal from "../components/CreateServiceModal.jsx";
import {Tag} from "@codegouvfr/react-dsfr/Tag.js";
import useAuth, {Roles} from "../auth/useAuth.js";
import CalendarItem from "../components/Calendar/CalendarItem.jsx";
import CalendarHeaderDate from "../components/Calendar/CalendarHeaderDate.jsx";

export default function Organisation() {
    const {organisationId} = useParams();
    const organisationSrv = useOrganisationService();
    const appointmentService = useAppointmentService();
    const [isUserProvider, setIsUserProvider] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isErrored, setIsErrored] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organisation, setOrganisation] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedSlotProvider, setSelectedSlotProvider] = useState(null);
    const navigate = useNavigate();
    const {data} = useAuth();
    const {t,i18n} = useTranslation();

    const loadService = () => {
        setIsLoading(true);

        Promise.all([
            organisationSrv.get(organisationId),
            organisationSrv.getSlots(organisationId),
        ]).then(([organisation, slots]) => {
            setOrganisation(organisation);
            setSlots(slots);
            setIsUserProvider(data.roles.includes(Roles.PROVIDER) && organisation.users.some((provider) => provider.id === data.id));
        }).catch((e) => {
            console.error(e);
            setIsErrored(true);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const handleServiceChange = (service) => {
        if (service === selectedService) {
            setSelectedService(null);
        } else {
            setSelectedService(service);
        }
    }

    const handleSlotSelection = (slot) => {
        setSelectedSlot(slot);
        if (slot.providers.length === 1) {
            setSelectedSlotProvider(slot.providers[0]);
        } else {
            setSelectedSlotProvider(null);
        }
        setIsModalOpen(true);
    }

    const handleProviderSelection = (provider) => {
        if (provider === selectedSlotProvider) {
            setSelectedSlotProvider(null);
        } else {
            setSelectedSlotProvider(provider);
        }
    }

    const handleSaveMeeting = () => {
        const data = {
            provider: `api/users/${selectedSlotProvider.id}`,
            datetime: selectedSlot.datetime,
            service: `api/services/${selectedService.id}`,
        };

        setIsSaving(true);
        appointmentService.create(data).then((appointment) => {
            setIsSaving(false);
            setIsModalOpen(false);
            navigate(`/appointment/${appointment.id}?display=success`);
        });
    }

    const handleOnServiceCreated = (service) => {
        organisation.services.push(service)
        setOrganisation({...organisation})
    }

    const isUserAuthorized = () => {
        return data.roles.includes(Roles.PROVIDER) &&
          organisation.users.some(user => user.id === data.id);
    };

    useEffect(() => {
        loadService();
    }, [organisationId]);

    if (isErrored) {
        return <InPageAlert alert={{severity: AlertSeverity.ERROR, closable: false}}/>;
    }

    if (isLoading) {
        return <PageLoader isLoading={isLoading}/>;
    }

    return (
        <div className="flex flex-column gap-2">
            <div className="flex space-between">
                <h1>{organisation.name}</h1>
                {isUserAuthorized() && <CreateServiceModal onServiceCreated={handleOnServiceCreated} organisationId={organisation.id}></CreateServiceModal>}
            </div>
                {isUserProvider &&
                <div>
                    <Button
                        iconId="ri-calendar-line"
                        onClick={() => navigate(`/appointments?organisation=${organisationId}`)}
                    >
                        Voir les rendez-vous de ce commissariat
                    </Button>
                </div>
            }

            {(organisation.services.length <= 0 || slots.length <= 0) &&
                  <>
                      <div className="flex flex-wrap gap-1">
                          {organisation.services.length > 0 && organisation.services.map((service) =>
                            <Tag key={service.id}>{service.title}</Tag>
                          )}
                      </div>


                        <CallOut
                            buttonProps={{
                                children: t('back'),
                                onClick: () => navigate(-1),
                            }}
                            iconId="ri-calendar-close-fill"
                            title={t('this_station_has_no_appointment')}

                        >
                            {t('this_station_has_no_appointment_details')}
                        </CallOut>

                  </>
            }

            {organisation.services.length > 0 && slots.length > 0 &&
                <>
                    <ActionTile>
                        <p className="margin-0">{t('available_service_at_this_station')}</p>

                        <div className="flex flex-wrap gap-2">
                            {organisation.services.map((service, index) => (
                                <Button
                                    className="btn-with-background"
                                    key={index}
                                    priority={selectedService === service ? "primary" : "secondary"}
                                    onClick={() => handleServiceChange(service)}
                                >
                                    {service.title}
                                </Button>
                            ))}
                        </div>
                    </ActionTile>

                    {selectedService === null &&
                        <Notice
                            title={t('please_select_a_service_before_selecting_a_date')}
                        />
                    }

                    {selectedService !== null &&
                        <>
                            <p className="margin-0">{selectedService.description}</p>
                            <Calendar
                                calendarDateHeader={CalendarHeaderDate}
                                calendarItem={CalendarItem}
                                data={slots}
                                onDateClick={(slot) => handleSlotSelection(slot)}
                            ></Calendar>
                        </>
                    }

                    <OrganisationLocation organisation={organisation} />
                </>
            }


            {isModalOpen && <Modal
                title={t('take_an_appointment')}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="flex flex-column gap-2">
                    <p className="margin-0">{
                        new Date(selectedSlot.datetime).toLocaleDateString(i18n.language, {
                            weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
                        })
                    }</p>


                    <ActionTile>
                        {selectedSlot.providers.length === 1 ?
                            <p className="margin-0">{t('youll_have_an_appointment_with')}</p> :
                            <p className="margin-0">{t('please_select_a_provider')}</p>
                        }
                        <div className="flex flex-wrap gap-2">
                            {selectedSlot.providers.map((provider, index) => (
                                <Button
                                    className="btn-with-background"
                                    key={index}
                                    priority={selectedSlotProvider && selectedSlotProvider.id === provider.id ? "primary" : "secondary"}
                                    onClick={() => handleProviderSelection(provider)}
                                >
                                    {provider.firstname} {provider.lastname}
                                </Button>
                            ))}
                        </div>
                    </ActionTile>

                    <div className="flex space-between">
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            priority="tertiary no outline"
                        >
                            {t('back')}
                        </Button>

                        <LoadableButton
                            onClick={() => handleSaveMeeting()}
                            disabled={selectedSlotProvider === null || isSaving}
                            isLoading={isSaving}
                        >
                            {t('take_an_appointment')}
                        </LoadableButton>
                    </div>
                </div>
            </Modal>}
        </div>
    );
}