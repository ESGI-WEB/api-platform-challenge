import { icon } from "leaflet"
import {Marker} from "react-leaflet";

const ICON = icon({
    iconUrl: "/marker.png",
    iconSize: [32, 32],
})

export default function PinMarker({ position, children }) {
    return (
        <Marker
            position={position}
            icon={ICON}
        >
            {children}
        </Marker>
    )
}