import useOrganisationService from "../services/useOrganisationService.js";
import {useState} from "react";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import Input from "@codegouvfr/react-dsfr/Input.js";
import {useTranslation} from "react-i18next";
import {Button} from "@codegouvfr/react-dsfr/Button";

// TODO rework, it's just a WIP page
export default function CreateService() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {t} = useTranslation();

    const AuthService = useOrganisationService();


    function handleClick() {
        AuthService.organisations().then((response) => {
            console.log(response);
        })
    }

    const handleCreateOrganisation = async (e) => {
        e.preventDefault();
        setMessage(t('service_created'));
        setIsLoading(true);

        AuthService.organisation(title, description).then((response) => {
            if (response) {
                setMessage();
                console.log(response);
            }
        }).catch((error) => {
            console.error(error);
            setAlert({
                description: t('error_occurred'),
                severity: AlertSeverity.ERROR,
            });
            window.scrollTo(0, 0);
        }).finally(() => setIsLoading(false));
    }


    return (
        <div>
            <InPageAlert alert={alert}/>
            <Button onClick={handleClick}>Get Data</Button>
            <form onSubmit={handleCreateOrganisation} className={'flex flex-center flex-column'}>
                <Input
                    label={t('title')}
                    nativeInputProps={{
                        type: 'text',
                    }}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    label={t('description')}
                    nativeInputProps={{
                        type: 'text',
                    }}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <LoadableButton type="submit" isLoading={isLoading}>{t('create_service')}</LoadableButton>
                <div className="message">{message ? <p>{message}</p> : null}</div>
            </form>
        </div>
    )
}