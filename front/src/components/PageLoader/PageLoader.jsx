import './PageLoader.css';

export default function PageLoader({
   isLoading = false,
   loaderIcon = 'ri-loader-4-line',
}) {
    return (
        isLoading &&
        <div className="page-loader">
            <i className={'page-loader-icon ' + loaderIcon}></i>
            <p>Chargement en cours...</p>
        </div>
    )
}