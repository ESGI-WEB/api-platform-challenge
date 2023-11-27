import {MapContainer, Marker, TileLayer} from "react-leaflet";
import ChangeView from "./ChangeView.jsx";
import OrganisationAddress from "./OrganisationAddress.jsx";

export default function OrganisationLocation({
    organisation,
    zoom = 17,
    className = "medium-map"
}) {
    if (!organisation ||
        organisation.longitude === null || organisation.longitude === undefined ||
        organisation.latitude === null || organisation.latitude === undefined
    ) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            <MapContainer center={[organisation.latitude, organisation.longitude]} zoom={zoom}
                          className={className}
            >
                <ChangeView center={[organisation.latitude, organisation.longitude]} zoom={zoom}/>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[organisation.latitude, organisation.longitude]}/>
            </MapContainer>
            <div>
                <OrganisationAddress organisation={organisation}/>
            </div>

        </div>
    )
};
