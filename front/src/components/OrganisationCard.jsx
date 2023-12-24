import {Card} from "@codegouvfr/react-dsfr/Card";
import {Tag} from "@codegouvfr/react-dsfr/Tag";
import OrganisationAddress from "./OrganisationAddress.jsx";
import {useTranslation} from "react-i18next";

export default function OrganisationCard({organisation, displayedServicesTags = 2}) {
    const {t} = useTranslation();

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
            endDetail={
                <span>
                    <OrganisationAddress organisation={organisation} withIcon/>
                </span>
            }
            desc={organisation.services.length > 0 && <>
                    <span className="fr-mb-2v">{t('services_available')}</span>
                    <span className="flex flex-wrap gap-1">
                        {organisation.services.slice(0, displayedServicesTags).map((service) =>
                            <Tag key={service.id}>{service.title}</Tag>
                        )}
                        {organisation.services.length > displayedServicesTags &&
                            <Tag>+{organisation.services.length - displayedServicesTags}</Tag>
                        }
                    </span>
            </>}
        />
    )
}