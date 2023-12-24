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

export default function Home() {
    const {t} = useTranslation();
    const [displayMap, setDisplayMap] = useState(false);
    const [organisations, setOrganisations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const organisationService = useOrganisationService();
    const [organisationPage, setOrganisationPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const zoom = 6;
    const mapRef = useRef(null);

    const loadOrganisations = () => {
        if (!hasNextPage) {
            return;
        }

        setIsLoading(true);
        organisationService.organisations(organisationPage).then((response) => {
            const allOrganisations = [...organisations, ...response['hydra:member']];
            setOrganisations(allOrganisations);
            setOrganisationPage(organisationPage + 1);
            setHasNextPage(!!response['hydra:view']['hydra:next']);

            const coordinates = allOrganisations.map((organisation) => [+organisation.latitude, +organisation.longitude]);
            const averageLatitude = coordinates.reduce((sum, coordinate) => sum + coordinate[0], 0) / coordinates.length;
            const averageLongitude = coordinates.reduce((sum, coordinate) => sum + coordinate[1], 0) / coordinates.length;
            setMapCenter([averageLatitude, averageLongitude]);
        }).catch((error) => {
            console.error(error);
        }).finally(() => setIsLoading(false));
    }

    useEffect(() => {
        if (organisations.length === 0) {
            loadOrganisations();
        }
    }, []);

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

            {displayMap && organisations.length > 0 &&
                <Map
                    center={mapCenter}
                    zoom={zoom}
                    className="large-map fr-mt-5v"
                    whenCreated={(map) => mapRef.current = map}
                >
                    {organisations.map((organisation) =>
                        <Marker key={organisation.id} position={[organisation.latitude, organisation.longitude]}>
                            <Popup>
                                <OrganisationAddress organisation={organisation}/>
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

                    {organisations.length > 0 && hasNextPage &&
                        <LoadableButton isLoading={isLoading} onClick={loadOrganisations}>{t('load_more')}</LoadableButton>
                    }
                </>
            }


            {organisations.length <= 0 && <PageLoader isLoading={isLoading}/>}

        </div>
    )
}