import { useTranslation } from "react-i18next";
import {useEffect, useState} from "react";
import useUserService from "../../services/useUserService.js";
import ProvidersToValidateTable from "../../components/Table/ProvidersToValidateTable.jsx";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import InPageAlert, {AlertSeverity} from "../../components/InPageAlert.jsx";
import Typography from "@mui/material/Typography";
import LoadableButton from "../../components/LoadableButton/LoadableButton.jsx";

export default function SuperintendentsToValidate() {
    const {t} = useTranslation();
    const userService = useUserService();
    const [providers, setProviders] = useState([]);
    const [providerPage, setProviderPage] = useState(1);
    const [loading, isLoading] = useState(true);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const [loadingNewRole, setLoadingNewRole] = useState({});

    const handleClickEditRole = (providerId, role) => {
        setLoadingNewRole((prevLoadingNewRole) => ({
            ...prevLoadingNewRole,
            [providerId]: true
        }));
        userService.patchUser(providerId, {roles: [role]}).then(() => {
            setProviders(providers.filter(provider => provider.id !== providerId));
        }).catch((error) => {
            console.error(error);
            setIsErrored(true);
        }).finally(() => {
            setLoadingNewRole((prevLoadingNewRole) => ({
                ...prevLoadingNewRole,
                [providerId]: false
            }));
        })
    }

    const fetchProviders = () => {
        if (!hasNextPage) {
            return;
        }
        isLoading(true);
        userService.getProvidersToValidate(providerPage).then((response) => {
            setProviders([...providers, ...response['hydra:member']]);
            setProviderPage(providerPage + 1);
            setHasNextPage(!!response['hydra:view']?.['hydra:next']);
        }).catch((error) => {
            console.error(error);
            setIsErrored(true);
        }).finally(() => isLoading(false));
    }

    useEffect(() => {
        if (providers.length === 0) {
            fetchProviders();
        }
    }, []);

    return (
        <>
            <Typography variant="h3" component="h1" gutterBottom>
                {t('new_superintendents')}
            </Typography>
            <InPageAlert alert={{
                title: t('new_superintendents_to_validate'),
                description: t('new_superintendents_to_validate_description'),
                severity: 'info',
            }} />
            {isErrored && <InPageAlert alert={{
                severity: AlertSeverity.ERROR,
                closable: false
            }}/>}
            {providers.length === 0 && !loading && <p>{t('no_providers_to_validate')}</p>}

            <div className="my-1">
                {providers.length > 0 && <ProvidersToValidateTable
                    loadingNewRole={loadingNewRole}
                    handleClickEditRole={handleClickEditRole}
                    providers={providers}/>}
            </div>
            {providers.length > 0 && hasNextPage &&
                <LoadableButton isLoading={loading} onClick={fetchProviders}>{t('load_more')}</LoadableButton>}
            {providers.length <= 0 && <PageLoader isLoading={loading}/>}
        </>
    );
}