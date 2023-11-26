export default function OrganisationAddress({
    organisation,
    withIcon = false,
    icon = 'ri-map-pin-2-line',
}) {
    return (
        <>
            <p className="margin-0">
                {withIcon && <i className={icon}> </i>}
                <strong>{organisation.name}</strong>
            </p>
            <p className="margin-0">{organisation.address}</p>
            <p className="margin-0">{organisation.zipcode} {organisation.city}</p>
        </>
    )
}