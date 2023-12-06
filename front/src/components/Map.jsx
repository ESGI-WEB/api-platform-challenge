import ChangeView from "./ChangeView.jsx";
import {MapContainer, TileLayer} from "react-leaflet";

export default function Map({
    center,
    className = "medium-map",
    zoom = 17,
    whenCreated = void 0,
    children,
}) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            className={className}
            whenCreated={whenCreated}
        >
            <ChangeView center={center} zoom={zoom}/>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    )
}