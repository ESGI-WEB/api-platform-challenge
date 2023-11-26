import {useMap} from "react-leaflet";

// used for leaft map to be rerendered
export default function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}