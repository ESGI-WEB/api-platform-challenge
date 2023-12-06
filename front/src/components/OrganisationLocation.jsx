import OrganisationAddress from "./OrganisationAddress.jsx";
import Map from "./Map.jsx";
import {Marker} from "react-leaflet";

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
            <Map
                center={[organisation.latitude, organisation.longitude]}
                zoom={zoom}
                className={className}
            >
                <Marker position={[organisation.latitude, organisation.longitude]}/>
            </Map>
            <div>
                <OrganisationAddress organisation={organisation}/>
            </div>

        </div>
    )
};
