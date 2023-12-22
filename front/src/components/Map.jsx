import MapEvents from "./MapEvents.jsx";
import {MapContainer, TileLayer} from "react-leaflet";
import MapLocator from "./MapLocator.jsx";

export default function Map({
    center,
    children,
    defaultLocation = [0, 0],
    className = "medium-map",
    zoom = 17,
    whenCreated = void 0,
    mapMoved = void 0,
    locateOnUser = false,
    useFlyTo = false,
}) {
    return (
        <MapContainer
            center={center ?? defaultLocation}
            zoom={zoom}
            className={className}
            whenCreated={whenCreated}
        >
            {locateOnUser && <MapLocator useFlyTo={useFlyTo}/>}
            <MapEvents mapMoved={mapMoved}/>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    )
}