import {parseHydraDocumentation} from "@api-platform/api-doc-parser";
import useAuth from "../../auth/useAuth.js";
import {
    fetchHydra as baseFetchHydra,
    HydraAdmin,
    hydraDataProvider, ResourceGuesser
} from '@api-platform/admin';
import MainDashboard from "../../components/Dashboard/MainDashboard/MainDashboard.jsx";
import LayoutDashboard from "../../components/Dashboard/LayoutDashboard.jsx";
export default function Admin() {

    const {token} = useAuth();

    const entrypoint = import.meta.env.VITE_API_ENDPOINT;

    const fetchHeaders = {'Authorization': `Bearer ${token}`};
    const fetchHydra = (url, options = {}) => baseFetchHydra(url, {
        ...options,
        headers: new Headers(fetchHeaders),
    });
    const apiDocumentationParser = entrypoint => parseHydraDocumentation(entrypoint, { headers: new Headers(fetchHeaders) });
    const dataProvider = hydraDataProvider({
        entrypoint,
        httpClient: fetchHydra,
        apiDocumentationParser: apiDocumentationParser,
        mercure: true,
        useEmbedded: false,
    });

    return (
        <HydraAdmin layout={LayoutDashboard} dashboard={MainDashboard} basename="/admin" dataProvider={dataProvider} entrypoint={entrypoint}>
            <ResourceGuesser name="users" />
            <ResourceGuesser name="appointments" />
        </HydraAdmin>
    )
}