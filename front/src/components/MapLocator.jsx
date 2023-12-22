import {Circle, FeatureGroup, Popup, useMapEvents} from "react-leaflet";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default function MapLocator({useFlyTo = false}) {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    });
    const {t} = useTranslation();

    useEffect(() => {
        if (!useFlyTo) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setPosition([position.coords.latitude, position.coords.longitude]);
                    map.setView([position.coords.latitude, position.coords.longitude], map.getZoom());
                })
            }
        } else {
            map.locate()
        }
    }, []);

    return position === null ? null : (
        <FeatureGroup pathOptions={{color: 'blue'}}>
            <Popup>{t('your_location')}</Popup>
            <Circle center={position} radius={50}/>
            <Circle center={position} radius={5}/>
        </FeatureGroup>
    )
}