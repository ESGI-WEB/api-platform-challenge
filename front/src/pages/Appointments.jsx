import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import useAppointmentService from "../services/useAppoitmentService.js";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import {useTranslation} from "react-i18next";
import {AppointmentStatus} from "../components/AppointmentStatusBadge.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import useAuth, {Roles} from "../auth/useAuth.js";
import CallOut from "@codegouvfr/react-dsfr/CallOut.js";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import AppointmentCard from "../components/AppointmentCard.jsx";

export default function Appointments() {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const auth = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const page = useRef(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const appointmentService = useAppointmentService();
    const isUserEmployee = auth.data.roles.includes(Roles.EMPLOYEE);
    const isUserProvider = auth.data.roles.includes(Roles.PROVIDER);
    const filters = useRef(['future']);
    const {search} = useLocation();
    const params = new URLSearchParams(search);
    const organisationId = params.get('organisation') || null;

    const getParsedFilters = () => {
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
        return parsedFilters;
    }
    const loadAppointments = () => {
        setIsLoading(true);

        let promise;
        if (isUserEmployee) {
            if (isUserProvider && organisationId) {
                promise = appointmentService.getOrganisationAppointments(page.current, organisationId, getParsedFilters());
            } else {
                promise = appointmentService.getProviderAppointments(page.current, getParsedFilters());
            }
        } else {
            promise = appointmentService.getClientAppointments(page.current, getParsedFilters());
        }

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

    const exportAppointments = () => {
        setIsExporting(true);
        let promise;
        if (isUserEmployee) {
            if (isUserProvider && organisationId) {
                promise = appointmentService.exportOrganisationAppointments(organisationId, getParsedFilters());
            } else {
                promise = appointmentService.exportProviderAppointments(getParsedFilters());
            }
        } else {
            promise = appointmentService.exportClientAppointments(getParsedFilters());
        }
        promise.finally(() => {
            setIsExporting(false);
        });
    }

    const handleFilters = (event, newFilters) => {
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
            <div className="flex gap-2 space-between">
                <h1>{organisationId ? t('organisation_appointments') : t('your_appointments')}</h1>

                {appointments.length > 0 &&
                    <LoadableButton isLoading={isExporting} onClick={exportAppointments} className="height-fit-content">
                        <i className="fr-icon-download-line"></i>
                    </LoadableButton>
                }
            </div>

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
                    <AppointmentCard appointment={appointment} enlargeLink={!isUserEmployee}/>
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
