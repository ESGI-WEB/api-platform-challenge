import {useState} from "react";
import {useParams} from "react-router-dom";
import PageLoader from "../components/PageLoader/PageLoader.jsx";

export default function Service() {
    const { serviceId } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <PageLoader isLoading={isLoading} />

        </>
    );
}