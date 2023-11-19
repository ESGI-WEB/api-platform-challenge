import Alert from "@codegouvfr/react-dsfr/Alert.js";
import {useTranslation} from "react-i18next";

export const AlertSeverity = {
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
    ERROR: 'error',
}

export default function InPageAlert({alert = null}) {
    const { t } = useTranslation();
    return (
        alert && <Alert
            closable={alert.closable ?? true}
            description={alert.description || t('error_occurred')}
            severity={alert.severity ?? AlertSeverity.INFO}
            title={alert.title}
            className={alert.className ?? 'fr-mb-2w'}
        />
    )
}