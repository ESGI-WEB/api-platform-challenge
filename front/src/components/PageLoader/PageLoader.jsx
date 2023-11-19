import './PageLoader.css';
import {useTranslation} from "react-i18next";

export default function PageLoader({
    isLoading = false,
    loaderIcon = 'ri-loader-4-line',
    loadingText = null,
    Component: Component = 'div',
}) {
    const { t } = useTranslation();

    loadingText = loadingText || t('loading');
    return (
        isLoading &&
        <Component className="page-loader">
            <i className={'page-loader-icon ' + loaderIcon}></i>
            <p>{loadingText}</p>
        </Component>
    )
}