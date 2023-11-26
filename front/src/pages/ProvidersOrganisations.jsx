import {useEffect, useState} from "react";
import useOrganisationService from "../services/useOrganisationService.js";
import {Card} from "@codegouvfr/react-dsfr/Card";
import {Button} from "@codegouvfr/react-dsfr/Button";
import {useNavigate} from "react-router-dom";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import {useTranslation} from "react-i18next";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import OrganisationCard from "../components/OrganisationCard.jsx";

export default function ProvidersOrganisations() {
    const {t} = useTranslation();
    const OrganisationService = useOrganisationService();
    const [organisations, setOrganisations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [organisationPage, setOrganisationPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    const fetchOrganisations = () => {
        if (!hasNextPage) {
            return;
        }
        setLoading(true);
        OrganisationService.providersOrganisations(organisationPage).then((response) => {
            setOrganisations([...organisations, ...response['hydra:member']]);
            setOrganisationPage(organisationPage + 1);
            setHasNextPage(!!response['hydra:view']['hydra:next']);
        }).catch((error) => {
            console.error(error);
        }).finally(() => setLoading(false));
    };


    const navigateToCreateOrganisation = () => {
        navigate('/create-organisation');
    };

    useEffect(() => {
        if (organisations.length === 0) {
            fetchOrganisations();
        }
    }, []);

    return (
        <div>
            <h1>{t('your_police_stations')}</h1>

            <div className="fr-mb-8v">
                <Button onClick={navigateToCreateOrganisation}>
                    {t('create_police_station')}
                </Button>
            </div>

            <div
                className={"flex gap-2 flex-wrap fr-mb-5v"}
            >
                {organisations.map(organisation =>
                    <OrganisationCard key={organisation.id} organisation={organisation}/>
                )}
            </div>
            {organisations.length > 0 && hasNextPage &&
                <LoadableButton isLoading={loading} onClick={fetchOrganisations}>{t('load_more')}</LoadableButton>}
            {organisations.length <= 0 && <PageLoader isLoading={loading}/>}
        </div>
    )
}

