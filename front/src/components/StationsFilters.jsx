"use client";

import useServiceService from "../services/useServiceService.js";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";

export default function StationsFilters({
    searchComponent: SearchComponent,
    selectComponent: SelectComponent,
    onSearch = void 0,
    disabled = false,
}) {
    const serviceSrv = useServiceService();
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [serviceSelected, setServiceSelected] = useState(null);
    const [search, setSearch] = useState('');

    useEffect( () => {
        serviceSrv.getServicesNames()
            .then(setServices)
            .catch(console.error)
            .finally(() => setLoadingServices(false));
    }, []);

    const handleOnSearch = (e) => {
        e.preventDefault();
        onSearch({
            service: serviceSelected,
            search,
        });
    }

    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
        }}>
            <Box sx={{
                flexGrow: 1,
                minWidth: 150,
                maxWidth: 300,
            }}>
                <SelectComponent
                    data={services}
                    loading={loadingServices}
                    onChange={(e) => setServiceSelected(e.target.value)}
                    disabled={disabled}
                />
            </Box>
            <Box sx={{flexGrow: 1}}>
                <SearchComponent
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={handleOnSearch}
                    disabled={disabled}
                />
            </Box>
        </Box>
    );
}