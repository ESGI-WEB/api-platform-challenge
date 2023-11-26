import {Card} from "@codegouvfr/react-dsfr/Card";
import {Tag} from "@codegouvfr/react-dsfr/Tag";
import OrganisationAddress from "./OrganisationAddress.jsx";

export default function OrganisationCard({organisation, displayedServicesTags = 2}) {
    return (
        <Card
            className={"fr-col-6 fr-col-md-6 fr-col-lg-3"}
            key={organisation.id}
            title={organisation.name}
            background
            border
            linkProps={{
                to: `/station/${organisation.id}`,
            }}
            titleAs="h3"
            endDetail={<div><OrganisationAddress organisation={organisation} withIcon/></div>}
            desc={organisation.services.length > 0 && <>
                    <p className="fr-mb-2v">Services proposés : </p>
                    <div className="flex flex-wrap gap-1">
                        {organisation.services.slice(0, displayedServicesTags).map((service) =>
                            <Tag key={service.id}>{service.title}</Tag>
                        )}
                        {organisation.services.length > displayedServicesTags &&
                            <Tag>+{organisation.services.length - displayedServicesTags}</Tag>
                        }
                    </div>
            </>}
        />
    )
}