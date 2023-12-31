import Button from "@codegouvfr/react-dsfr/Button.js";
import './LoadableButton.css';

export default function LoadableButton({
    className = '',
    isLoading = false,
    loaderIcon = 'ri-loader-4-line',
    onClick = void 0,
    priority = 'primary',
    children,
    disabled = false,
}) {
    return (
        <Button
            disabled={isLoading || disabled}
            priority={priority}
            onClick={onClick}
            className={className}
        >
            {children}
            {isLoading && <i className={'loading-icon ' + loaderIcon}></i>}
        </Button>
    )
}