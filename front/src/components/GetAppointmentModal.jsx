import ActionTile from "./ActionTile/ActionTile.jsx";
import LoadableButton from "./LoadableButton/LoadableButton.jsx";
import Modal from "./Modal/Modal.jsx";
import {useTranslation} from "react-i18next";
import {Button} from "@codegouvfr/react-dsfr/Button";
import useAppointmentService from "../services/useAppoitmentService.js";
import {useEffect, useState} from "react";

export default function GetAppointmentModal({
    selectedSlot,
    selectedService,
    setIsModalOpen = void 0,
    onSaved = void 0,
}) {
    const {t, i18n} = useTranslation();
    const appointmentService = useAppointmentService();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSlotProvider, setSelectedSlotProvider] = useState(null);

    useEffect(() => {
        if (selectedSlot.providers.length === 1) {
            setSelectedSlotProvider(selectedSlot.providers[0]);
        } else {
            setSelectedSlotProvider(null);
        }
    }, [selectedSlot]);

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
            onSaved(appointment);
        }).catch((e) => {
            console.error(e);
            setIsSaving(false);
        });
    }

    return (
        <Modal
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
        </Modal>
    )
}