import {Link} from "react-router-dom";
import './LinkButton.css';

export default function LinkButton({
    to = '/',
    prefixIcon,
    suffixIcon,
    children,
    className = 'fr-link link-button',
}) {
    return (
        <Link to={to} className={className}>
            {prefixIcon && <i className={prefixIcon + ' prefix-icon'} />}
            {children}
            {suffixIcon && <i className={suffixIcon + ' suffix-icon'} />}
        </Link>
    )
}