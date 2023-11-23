import {useTranslation} from "react-i18next";

export default function Admin() {

    const { t} = useTranslation();

    return (
        <div>
            <h1>{t('admin')}</h1>
        </div>
    )
}