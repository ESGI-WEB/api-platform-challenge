import {MapContainer, Marker, TileLayer} from "react-leaflet";

export default function OrganisationLocation({organisation}) {
    return (
        <div className="flex flex-wrap gap-2">
            {organisation.longitude !== null && organisation.latitude !== null &&
                <MapContainer center={[organisation.latitude, organisation.longitude]} zoom={17}
                              className="medium-map"
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[organisation.latitude, organisation.longitude]}/>
                </MapContainer>
            }
            <div>
                <p className="margin-0"><strong>{organisation.name}</strong></p>
            </div>
        </div>
    )
};
