import OrganisationAddress from "./OrganisationAddress.jsx";
import {useTranslation} from "react-i18next";
import OrganisationServicesList from "./OrganisationServicesList.jsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {useNavigate} from "react-router-dom";

export default function OrganisationCard({organisation, displayedServicesTags = 2, style = {}}) {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const goToStation = () => {
        navigate(`/station/${organisation.id}`);
    }

    return (
        <Card variant="outlined" sx={{
            cursor: 'pointer',
            ...style
        }} onClick={goToStation}>
            <CardContent>
                <div className="flex flex-column gap-2">
                    <Typography variant="h3" color="text.secondary">
                        {organisation.name}
                    </Typography>
                    <Divider component="div"/>
                    <div>
                        {organisation.services.length > 0 &&
                            <>
                                <span className="fr-mb-2v">{t('services_available')}</span>
                                <OrganisationServicesList services={organisation.services}
                                                          displayedServicesTags={displayedServicesTags}/>
                            </>
                        }
                        {organisation.services.length <= 0 &&
                            <span className="fr-mb-2v">{t('no_services_available')}</span>
                        }
                    </div>
                    <div>
                        <OrganisationAddress organisation={organisation} withIcon/>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}