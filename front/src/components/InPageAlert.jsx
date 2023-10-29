import Alert from "@codegouvfr/react-dsfr/Alert.js";

export const AlertSeverity = {
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
    ERROR: 'error',
}

export default function InPageAlert({alert = null}) {
    return (
        alert && <Alert
            closable
            description={alert.description}
            severity={alert.severity ?? AlertSeverity.INFO}
            title={alert.title}
            className={alert.className ?? 'fr-mb-2w'}
        />
    )
}