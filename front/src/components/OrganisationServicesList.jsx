import {Tag} from "@codegouvfr/react-dsfr/Tag";

export default function OrganisationServicesList({services, displayedServicesTags = 2}) {

    return (
        <>
            <span className="flex flex-wrap gap-1">
                {services.slice(0, displayedServicesTags).map((service) =>
                    <Tag key={service.id}>{service.title}</Tag>
                )}
                {services.length > displayedServicesTags &&
                    <Tag>+{services.length - displayedServicesTags}</Tag>
                }
            </span>
        </>
    )
}