import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import OrganisationCard from "../components/OrganisationCard.jsx";
import useOrganisationService from "../services/useOrganisationService.js";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import {Marker, Popup} from "react-leaflet";
import OrganisationAddress from "../components/OrganisationAddress.jsx";
import Map from "../components/Map.jsx";
import {Button} from "@codegouvfr/react-dsfr/Button";
import LinkButton from "../components/LinkButton/LinkButton.jsx";
import OrganisationServicesList from "../components/OrganisationServicesList.jsx";

export default function Home() {
    const {t} = useTranslation();
    const [displayMap, setDisplayMap] = useState(false);
    const [organisations, setOrganisations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const organisationService = useOrganisationService();
    const [hasNextPage, setHasNextPage] = useState(true);
    const organisationPage = useRef(1);
    const zoom = 6;

    const loadOrganisations = (filters) => {
        if (!hasNextPage) {
            return;
        }

        setIsLoading(true);

        organisationService.organisations(organisationPage.current, filters).then((response) => {
            const newOrganisations = response['hydra:member'].filter((organisation) => {
                return !organisations.find((o) => o.id === organisation.id);
            });
            setOrganisations([...organisations, ...newOrganisations]);

            organisationPage.current++;
            setHasNextPage(!!response['hydra:view']['hydra:next']);
        }).catch((error) => {
            console.error(error);
        }).finally(() => setIsLoading(false));
    }

    useEffect(() => {
        if (organisations.length === 0) {
            loadOrganisations();
        }
    }, []);

    const handleMapMove = (e) => {
        const bounds = e.target.getBounds();
        const filters = {
            'latitude[between]': [bounds.getSouth(), bounds.getNorth()].join('..'),
            'longitude[between]': [bounds.getWest(), bounds.getEast()].join('..'),
        };
        organisationPage.current = 1;
        setHasNextPage(true);
        loadOrganisations(filters, true);
    };

    return (
        <div>
            <div className="flex space-between align-baseline">
                <h1>{t('home')}</h1>
                {organisations.length > 0 &&
                    <Button
                        className="height-fit-content"
                        priority="tertiary"
                        onClick={() => setDisplayMap(!displayMap)}
                    >
                        <i className="ri-map-2-line fr-mr-1w"></i>
                        {displayMap ? t('hide_map') : t('display_map')}
                    </Button>
                }
            </div>

            {displayMap &&
                <Map
                    locateOnUser
                    defaultLocation={[46.227638, 2.213749]}
                    className="large-map fr-my-5v"
                    mapMoved={handleMapMove}
                >
                    {organisations.map((organisation) =>
                        <Marker key={organisation.id} position={[organisation.latitude, organisation.longitude]}>
                            <Popup>
                                <OrganisationAddress organisation={organisation}/>
                                <p>
                                    <OrganisationServicesList services={organisation.services}/>
                                </p>
                                <LinkButton
                                    to={`/station/${organisation.id}`}
                                >
                                    {t('see_police_station_details')}
                                </LinkButton>
                            </Popup>
                        </Marker>
                    )}
                </Map>
            }

            {!displayMap &&
                <>
                    <div className="flex flex-wrap gap-2 fr-my-5v">
                        {organisations.map((organisation) =>
                            <OrganisationCard key={organisation.id} organisation={organisation}/>
                        )}
                    </div>

                    {organisations.length <= 0 && <PageLoader isLoading={isLoading}/>}
                </>
            }

            {organisations.length > 0 && hasNextPage &&
                <LoadableButton isLoading={isLoading} onClick={loadOrganisations}>{t('load_more')}</LoadableButton>
            }

        </div>
    )
}