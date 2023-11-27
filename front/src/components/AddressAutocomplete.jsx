import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useOrganisationService from "../services/useOrganisationService.js";

export default function AddressAutocomplete({
    onChange = void 0,
    state = null,
    stateRelatedMessage = null,
}) {
    const [inputValue, setInputValue] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [options, setOptions] = React.useState([]);
    const organisationService = useOrganisationService();

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (!inputValue) {
                return;
            }

            organisationService.getCoordinatesFromAddress(inputValue).then((response) => {
                setOptions(response.features ?? []);
            })
        }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [inputValue, fetch]);

    return (<div className="full-width">
        <Autocomplete
            sx={{width: '100%'}}
            getOptionLabel={(option) => option.properties.label}
            filterOptions={(x) => x}
            filterSelectedOptions
            options={options}
            isOptionEqualToValue={(option, value) => {
                return option.properties.id === value.properties.id;
            }}
            autoComplete
            noOptionsText="No locations"
            value={selectedValue}
            onChange={(event, newValue) => {
                setSelectedValue(newValue);
                onChange(newValue);
            }}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            renderInput={(params) => (
                <TextField {...params} label="Add a location" fullWidth/>
            )}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        {option.properties.label}
                    </li>
                );
            }}
        />
        {state && stateRelatedMessage && <p className={`fr-error-text ${state}`}>{stateRelatedMessage}</p>}
    </div>);
}
