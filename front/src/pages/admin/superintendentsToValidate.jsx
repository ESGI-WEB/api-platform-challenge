import { useTranslation } from "react-i18next";
import {useEffect, useState} from "react";
import useUserService from "../../services/useUserService.js";
import ProvidersToValidateTable from "../../components/Table/ProvidersToValidateTable.jsx";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import InPageAlert, {AlertSeverity} from "../../components/InPageAlert.jsx";
import Typography from "@mui/material/Typography";

export default function SuperintendentsToValidate() {
    const {t} = useTranslation();
    const userService = useUserService();
    const [providers, setProviders] = useState([]);
    const [providerPage, setProviderPage] = useState(1);
    const [loading, isLoading] = useState(true);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isErrored, setIsErrored] = useState(false);

    const handleClickValidate = (provider) => {
        console.log('validate', provider)
    }

    const handleClickRefuse = (provider) => {
        console.log('refuse', provider)
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
                {t('new_superintendents_to_validate')}
            </Typography>
            <InPageAlert alert={{
                title: t('new_superintendents_to_validate_title'),
                description: t('new_superintendents_to_validate_description'),
                severity: 'info',
            }} />
            <PageLoader isLoading={loading}/>
            {isErrored && <InPageAlert alert={{
                severity: AlertSeverity.ERROR,
                closable: false
            }}/>}
            {providers.length === 0 && !loading && <p>{t('no_providers_to_validate')}</p>}

            {providers.length > 0 && <ProvidersToValidateTable handleClickValidate={handleClickValidate}
                                                               handleClickRefuse={handleClickRefuse}
                                                               providers={providers}/>}
        </>
    );
}