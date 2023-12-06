import './PageLoader.css';
import {useTranslation} from "react-i18next";

export default function PageLoader({
    isLoading = false,
    loaderIcon = 'ri-loader-4-line',
    loadingText = null,
    Component: Component = 'div',
    className = '',
}) {
    const { t } = useTranslation();

    loadingText = loadingText || t('loading');
    return (
        isLoading &&
        <Component className={"page-loader " + className}>
            <i className={'page-loader-icon ' + loaderIcon}></i>
            <p>{loadingText}</p>
        </Component>
    )
}