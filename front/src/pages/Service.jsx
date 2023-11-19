import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import useApi from "../services/useApi.js";
import useServiceService from "../services/useServiceService.js";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import useOrganisationService from "../services/useOrganisationService.js";

export default function Service() {
    const { serviceId } = useParams();
    const serviceSrv = useServiceService();
    const organisationSrv = useOrganisationService();
    const [isLoading, setIsLoading] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    let service = null;
    let slots = [];

    const loadService = async () => {
        setIsLoading(true);
        try {
            service = await serviceSrv.get(serviceId);
            console.log(service)
            slots = await organisationSrv.getSlots(service.organisation.id);
            setIsLoading(false);
        } catch (e) {
            console.error(e);
            setIsErrored(true);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadService();
    }, []);

    return (
        <>
            {isErrored && <InPageAlert alert={{severity: AlertSeverity.ERROR, closable: false}} />}
            <PageLoader isLoading={isLoading} />

        </>
    );
}