import {Circle, FeatureGroup, Popup, useMapEvents} from "react-leaflet";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default function MapLocator(
    zoom = 17,
) {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng)
        },
    });
    const {t} = useTranslation();

    useEffect(() => {
        map.locate({
            setView: true,
            enableHighAccuracy: true,
            maxZoom: zoom,
        })
    }, []);

    return position === null ? null : (
        <FeatureGroup pathOptions={{color: 'blue'}}>
            <Popup>{t('your_location')}</Popup>
            <Circle center={position} radius={50}/>
            <Circle center={position} radius={5}/>
        </FeatureGroup>
    )
}