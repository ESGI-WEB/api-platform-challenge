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
import StationsFilters from "../components/StationsFilters.jsx";
import Search from "../components/Search.jsx";
import ServicesSelect from "../components/ServicesSelect.jsx";

export default function Home() {
    const {t} = useTranslation();
    const [displayMap, setDisplayMap] = useState(false);
    const [organisations, setOrganisations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const organisationService = useOrganisationService();
    const [hasNextPage, setHasNextPage] = useState(true);
    const organisationPage = useRef(1);
    const filters = useRef({});
    const mapMovedTimeout = useRef(null);
    const cardStyle = {
        width: '32%',
        minWidth: '240px',
    }

    const loadOrganisations = (filters = {}, reset = false) => {
        if (reset) {
            organisationPage.current = 1;
            setOrganisations([]);
        }

        setIsLoading(true);

        organisationService.organisations(organisationPage.current, filters).then((response) => {
            if (reset) {
                setOrganisations(response['hydra:member']);
            } else {
                const newOrganisations = response['hydra:member'].filter((organisation) => {
                    return !organisations.find((o) => o.id === organisation.id);
                });
                setOrganisations([...organisations, ...newOrganisations]);
            }

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

    useEffect(() => {
        const keysToReset = ['latitude[between]', 'longitude[between]'];
        filters.current = Object.keys(filters.current).reduce((acc, key) => {
            if (!keysToReset.includes(key)) {
                acc[key] = filters.current[key];
            }
            return acc;
        }, {});

        loadOrganisations(filters.current, true);
    }, [displayMap]);

    const handleMapMove = (e) => {
        if (mapMovedTimeout.current) {
            clearTimeout(mapMovedTimeout.current);
        }

        mapMovedTimeout.current = setTimeout(() => {
            const bounds = e.target.getBounds();
            filters.current = purifyFilters({
                ...filters.current,
                'latitude[between]': [bounds.getSouth(), bounds.getNorth()].join('..'),
                'longitude[between]': [bounds.getWest(), bounds.getEast()].join('..'),
            });
            organisationPage.current = 1;
            setHasNextPage(true);
            loadOrganisations(filters.current);
        }, 1000);
    };

    const handleSearch = (searchFilters) => {
        organisationPage.current = 1;
        setHasNextPage(true);

        filters.current = purifyFilters({
            ...filters.current,
            'services.title': [searchFilters.service],
            'search': searchFilters.search,
        });

        loadOrganisations(filters.current, true);
    }

    const purifyFilters = (filters) => {
        const isNullish = (value) => value === null || value === '' || value === undefined;

        return Object.keys(filters).reduce((acc, key) => {
            if (!isNullish(filters[key]) && (!Array.isArray(filters[key]) || filters[key].some(e => !isNullish(e)))) {
                acc[key] = filters[key];
            }
            return acc;
        }, {});
    }

    return (
        <div>
            <div className="flex space-between align-baseline">
                <h1>{t('home')}</h1>
                <Button
                    className="height-fit-content"
                    priority="tertiary"
                    onClick={() => setDisplayMap(!displayMap)}
                >
                    <i className="ri-map-2-line fr-mr-1w"></i>
                    {displayMap ? t('hide_map') : t('display_map')}
                </Button>
            </div>

            <StationsFilters
                selectComponent={ServicesSelect}
                searchComponent={Search}
                onSearch={handleSearch}
                disabled={isLoading}
            />

            {displayMap && <>
                {organisations.length <= 0 && <PageLoader isLoading={isLoading}/>}
                <Map
                    locateOnUser
                    defaultLocation={[48.866667, 2.333333]} // Paris
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
            </>
            }

            {!displayMap &&
                <>
                    <div className="flex flex-wrap row-gap-2 column-gap-2-percent fr-my-5v">
                        {organisations.map((organisation) =>
                            <OrganisationCard key={organisation.id} organisation={organisation} style={cardStyle}/>
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