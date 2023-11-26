import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import OrganisationCard from "../components/OrganisationCard.jsx";
import useOrganisationService from "../services/useOrganisationService.js";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import ChangeView from "../components/ChangeView.jsx";
import OrganisationAddress from "../components/OrganisationAddress.jsx";

export default function Home() {
    const {t} = useTranslation();
    const [organisations, setOrganisations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const organisationService = useOrganisationService();
    const [organisationPage, setOrganisationPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [mapCenter, setMapCenter] = useState([46.9965771,1.6894783]); // france center by default
    const zoom = 5;
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
            <h1>{t('home')}</h1>

            <MapContainer center={mapCenter} zoom={zoom}
                          className="large-map"
                          whenCreated={(map) => mapRef.current = map}
            >
                <ChangeView center={mapCenter} zoom={zoom}/>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {organisations.map((organisation) =>
                    <Marker key={organisation.id} position={[organisation.latitude, organisation.longitude]}>
                        <Popup>
                            <OrganisationAddress organisation={organisation}/>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <div className="flex">
                <div className="flex flex-wrap gap-2 fr-mb-5v">
                    {organisations.map((organisation) =>
                        <OrganisationCard key={organisation.id} organisation={organisation}/>
                    )}
                </div>


            </div>


            {organisations.length > 0 && hasNextPage &&
                <LoadableButton isLoading={isLoading} onClick={loadOrganisations}>{t('load_more')}</LoadableButton>}
            {organisations.length <= 0 && <PageLoader isLoading={isLoading}/>}

        </div>
    )
}