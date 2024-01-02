import {useMap} from "react-leaflet";
import {useEffect} from "react";

// used for leaft map to be rerendered
export default function MapEvents({ mapMoved = void 0 }) {
    const map = useMap();

    useEffect(() => {
        map.on('moveend', mapMoved);
        return () => map.off('moveend', mapMoved);
    }, [map]);

    return null;
}