import {useState} from "react";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import Input from "@codegouvfr/react-dsfr/Input.js";
import OrganisationLocation from "../components/OrganisationLocation.jsx";
import useOrganisationService from "../services/useOrganisationService.js";
import AddressAutocomplete from "../components/AddressAutocomplete.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function CreateOrganisation() {
    // TODO TO REWORD (translations, form with addresses)
    const [organisation, setOrganisation] = useState({});
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const errorState = {state: 'error', text: 'This field is required'};
    const [nameInputState, setNameInputState] = useState({});
    const [addressInputState, setAddressInputState] = useState({});

    const organisationService = useOrganisationService();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const handleCreateOrganisation = async (e) => {
        e.preventDefault();
        setNameInputState({});
        setAddressInputState({});
        setAlert(null);

        if (!organisation.name) {
            setNameInputState(errorState);
            return;
        }

        if (!isFinite(organisation.latitude) || !isFinite(organisation.longitude)) {
            setAddressInputState(errorState);
            return;
        }
        setIsLoading(true);

        organisationService.createOrganisation(organisation).then((response) => {
            if (response) {
                navigate(`/station/${response.id}`);
            }
        }).catch((error) => {
            console.error(error)
            setAlert({
                severity: AlertSeverity.ERROR,
            });
            window.scrollTo(0, 0)
        }).finally(() => setIsLoading(false));
    }

    const handleAddressChange = (address) => {
        setAddressInputState({});
        if (!address) {
            return;
        }

        organisation.address = address.properties.name;
        organisation.zipcode = address.properties.postcode;
        organisation.city = address.properties.city;
        organisation.latitude = address.geometry.coordinates[1].toString();
        organisation.longitude = address.geometry.coordinates[0].toString();

        setOrganisation({...organisation});
    }

    const handleNameChange = (name) => {
        organisation.name = name;
        setOrganisation(organisation);
    }

    return (
        <div className="flex flex-column gap-2 justify-center fr-col-8 fr-m-auto">
            <InPageAlert alert={alert}/>
            <form onSubmit={handleCreateOrganisation} className={'flex flex-column gap-2'}>
                <Input
                    label="Name"
                    nativeInputProps={{
                        type: 'text',
                    }}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="fr-mb-0 full-width"
                    state={nameInputState.state}
                    stateRelatedMessage={nameInputState.text}
                />

                <AddressAutocomplete
                    state={addressInputState.state}
                    stateRelatedMessage={addressInputState.text}
                    onChange={(address) => handleAddressChange(address)}
                ></AddressAutocomplete>

                <OrganisationLocation organisation={organisation}/>

                <LoadableButton className="fr-ml-auto" type="submit" isLoading={isLoading}>{t('create_police_station')}</LoadableButton>
            </form>
        </div>
    )
}