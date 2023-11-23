import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import useOrganisationService from "../services/useOrganisationService.js";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import Calendar from "../components/Calendar/Calendar.jsx";
import CallOut from "@codegouvfr/react-dsfr/CallOut.js";
import Notice from "@codegouvfr/react-dsfr/Notice.js";
import Button from "@codegouvfr/react-dsfr/Button.js";
import ActionTile from "../components/ActionTile/ActionTile.jsx";
import {createModal} from "@codegouvfr/react-dsfr/Modal";
import useAppointmentService from "../services/useAppoitmentService.js";

const modal = createModal({
    id: "slot-reservation-modal",
    isOpenedByDefault: false,
});

export default function Organisation() {
    const {organisationId} = useParams();
    const organisationSrv = useOrganisationService();
    const appointmentService = useAppointmentService();
    const [isLoading, setIsLoading] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const [organisation, setOrganisation] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedSlotProvider, setSelectedSlotProvider] = useState(null);
    const navigate = useNavigate();

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
        if (slot.providers.length === 1) {
            setSelectedSlotProvider(slot.providers[0]);
        } else {
            setSelectedSlotProvider(null);
        }
        modal.open();
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
            provider: selectedSlotProvider.id,
            datetime: selectedSlot.datetime,
            service: selectedService.id,
        }; // todo max width container global

        appointmentService.create(data).then((appointment) => {
            console.log(appointment);
        });
    }

    useEffect(() => {
        if (organisation === null || slots.length <= 0) {
            loadService();
        }
    }, []);

    if (isErrored) {
        return <InPageAlert alert={{severity: AlertSeverity.ERROR, closable: false}}/>;
    }

    if (isLoading) {
        return <PageLoader isLoading={isLoading}/>;
    }

    return (
        <div className="flex flex-column gap-2">
            <h1>{organisation.name}</h1>

            {(organisation.services.length <= 0 || slots.length <= 0) &&
                <CallOut
                    buttonProps={{
                        children: "Retour",
                        onClick: () => navigate(-1),
                    }}
                    iconId="ri-calendar-close-fill"
                    title="Ce commissariat ne propose pas de rendez-vous en ligne actuellement"

                >
                    Il est possible que ce commissariat propose des rendez-vous en ligne prochainement. N'hésitez pas à
                    revenir plus tard ou à vous rendre directement sur place. Sinon, vous pouvez rechercher un autre
                    commissariat à proximité.
                </CallOut>
            }

            {organisation.services.length > 0 && slots.length > 0 &&
                <>
                    <ActionTile>
                        <p className="margin-0">Les services disponibles dans ce commissariat</p>

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
                            title="Choissisez un service ci-dessus avant de prendre un rendez-vous"
                        />
                    }

                    {selectedService !== null &&
                        <>
                            <p className="margin-0">{selectedService.description}</p>
                            <Calendar
                                data={slots}
                                onDateClick={(slot) => handleSlotSelection(slot)}
                            ></Calendar>
                        </>
                    }

                    {organisation.longitude !== null && organisation.latitude !== null &&
                        <div className="flex flex-wrap gap-2">
                            <MapContainer center={[organisation.latitude, organisation.longitude]} zoom={17}
                                          className="medium-map"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[organisation.latitude, organisation.longitude]}/>
                            </MapContainer>
                            <div>
                                <p className="margin-0">{organisation.name}</p>
                            </div>
                        </div>
                    }
                </>
            }


            <modal.Component
                title="Prendre rendez-vous"
                iconId="ri-calendar-check-line"
                buttons={
                    [
                        {
                            children: "Retour"
                        },
                        {
                            onClick: () => handleSaveMeeting(),
                            children: "Prendre rendez-vous",
                            disabled: selectedSlotProvider === null,
                        }
                    ]
                }
            >
                {selectedSlot && <>
                    <p>{
                        new Date(selectedSlot.datetime).toLocaleDateString(undefined, {
                            weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
                        })
                    }</p>


                    <ActionTile>
                        {selectedSlot.providers.length === 1 ?
                            <p className="margin-0">Vous aurez rendez-vous avec</p> :
                            <p className="margin-0">Choississez avec qui vous souhaitez prendre rendez-vous</p>
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
                </>}
            </modal.Component>
        </div>
    );
}