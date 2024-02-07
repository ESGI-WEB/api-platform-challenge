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
import {useTranslation} from "react-i18next";
import OrganisationLocation from "../components/OrganisationLocation.jsx";
import CreateServiceModal from "../components/CreateServiceModal.jsx";
import useAuth, {Roles} from "../auth/useAuth.js";
import CalendarItem from "../components/Calendar/CalendarItem.jsx";
import CalendarHeaderDate from "../components/Calendar/CalendarHeaderDate.jsx";
import ServiceTag from "../components/ServiceTag.jsx";
import GetAppointmentModal from "../components/GetAppointmentModal.jsx";
import EditServiceFeedback from "../components/EditServiceFeedback.jsx";

export default function Organisation() {
    const {organisationId} = useParams();
    const organisationSrv = useOrganisationService();
    const [isLoading, setIsLoading] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
    const [organisation, setOrganisation] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [hasUserEditRights, setHasUserEditRights] = useState(false);
    const navigate = useNavigate();
    const {data} = useAuth();
    const {t} = useTranslation();

    const loadService = () => {
        setIsLoading(true);

        Promise.all([
            organisationSrv.get(organisationId),
            organisationSrv.getSlots(organisationId),
        ]).then(([organisation, slots]) => {
            setOrganisation(organisation);
            setSlots(slots);
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
        setIsModalOpen(true);
    }

    const handleOnServiceCreated = (service) => {
        organisation.services.push(service)
        setOrganisation({...organisation})
    }

    const handleEditForm = (service) => {
        if (!hasUserEditRights) {
            return;
        }
        setSelectedService(service);
        setIsServiceFormOpen(true);
    }

    useEffect(() => {
        loadService();
        setHasUserEditRights(false);
    }, [organisationId]);

    useEffect(() => {
        setHasUserEditRights(
            organisation?.users?.length > 0 &&
            data?.roles?.length > 0 &&
            data.roles.includes(Roles.PROVIDER) &&
            organisation.users.some(user => user.id === data.id)
        );
    }, [organisation, data]);

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
            </div>

            {hasUserEditRights &&
                <div className="flex flex-row gap-2">
                    <Button
                        iconId="ri-calendar-line"
                        onClick={() => navigate(`/appointments?organisation=${organisationId}`)}
                    >
                        {t('see_police_station_appointments')}
                    </Button>
                    <CreateServiceModal onServiceCreated={handleOnServiceCreated} organisationId={organisation.id}></CreateServiceModal>
                </div>
            }

            {(organisation.services.length <= 0 || slots.length <= 0) &&
                <>
                    <ServiceTag
                        services={organisation.services}
                        iconName={hasUserEditRights ? "ri-survey-line" : null}
                        onIconClick={handleEditForm}
                    />

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

                        <ServiceTag
                            services={organisation.services}
                            className="btn-with-background"
                            priority={(service) => selectedService === service ? "primary" : "secondary"}
                            component={Button}
                            iconName={hasUserEditRights ? "ri-survey-line" : null}
                            onTagClick={handleServiceChange}
                            onIconClick={handleEditForm}
                        />
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


            {isModalOpen &&
                <GetAppointmentModal
                    selectedSlot={selectedSlot}
                    selectedService={selectedService}
                    setIsModalOpen={setIsModalOpen}
                    onSaved={(appointment) => navigate(`/appointment/${appointment.id}?display=success`)}
                />
            }

            {isServiceFormOpen &&
                <EditServiceFeedback
                    setIsModalOpen={setIsServiceFormOpen}
                    serviceId={selectedService.id}
                />
            }
        </div>
    );
}