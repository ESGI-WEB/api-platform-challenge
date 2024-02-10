import {Button} from "@codegouvfr/react-dsfr/Button";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default function DownloadButton({ fileUrl }) {
    const {t} = useTranslation();
    const [downloadUrl, setDownloadUrl] = useState(null);
    const baseUrl = import.meta.env.VITE_ENDPOINT;

    useEffect(() => {
        setDownloadUrl(`${baseUrl}${fileUrl}`);
    }, []);

    return (
        <Button priority="tertiary no outline">
            <a target="_blank" href={downloadUrl}>{t('download')}</a>
        </Button>
    );
}