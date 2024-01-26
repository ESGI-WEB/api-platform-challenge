import {useTranslation} from "react-i18next";
import useOrganisationService from "../services/useOrganisationService.js";
import {useEffect, useState} from "react";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import AccordionElement from "../components/AccordionElement.jsx";

export default function ManageTeams() {
    const {t} = useTranslation();
    const organisationService = useOrganisationService();
    const [organisations, setOrganisations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [organisationPage, setOrganisationPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [error, setError] = useState({});
    const [isAddEmployeeLoading, setIsAddEmployeeLoading] = useState({});

    const handleClickAddEmployee = (employeeEmail, organisationId) => {
        setIsAddEmployeeLoading((prevIsAddEmployeeLoading) => ({
            ...prevIsAddEmployeeLoading,
            [organisationId]: true
        }));
        const emailUser = {
            email : employeeEmail
        }
        organisationService.addUserToOrganisation(organisationId, emailUser)
            .then((response) => {
                setOrganisations(organisations.map(organisation => {
                    if (organisation.id === organisationId) {
                        organisation.users.push(response.user);
                    }
                    return organisation;
                }));
            })
            .catch((error) => {
                setError((prevErrors) => ({
                    ...prevErrors,
                    [organisationId]: "Il y a eu une erreur lors de l'ajout de l'utilisateur à l'organisation"
                }));
            })
            .finally(() => setIsAddEmployeeLoading(false));
    }

    const handleClickRemoveEmployee = (organisationId, userId) => {
        organisationService.removeUserFromOrganisation(organisationId, userId)
            .then(() => {
                setOrganisations(organisations.map(organisation => {
                    if (organisation.id === organisationId) {
                        organisation.users = organisation.users.filter(user => user.id !== userId);
                    }
                    return organisation;
                }));
            })
            .catch((error) => {
                setError((prevErrors) => ({
                    ...prevErrors,
                    [organisationId]: "Il y a eu une erreur lors de l'ajout de l'utilisateur à l'organisation"
                }));
            })
    }

    const fetchOrganisations = () => {
        if (!hasNextPage) {
            return;
        }
        setLoading(true);
        organisationService.providersOrganisations(organisationPage).then((response) => {
            setOrganisations([...organisations, ...response['hydra:member']]);
            setOrganisationPage(organisationPage + 1);
            setHasNextPage(!!response['hydra:view']['hydra:next']);
        }).catch((error) => {
            console.error(error);
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        if (organisations.length === 0) {
            fetchOrganisations();
        }
    }, []);

    return (
       <>
          <h1>{t('manage_teams')}</h1>
           <div className="my-1">
               {organisations.map(organisation =>
                   <AccordionElement
                       key={organisation.id}
                       organisation={organisation}
                       isAddEmployeeLoading={isAddEmployeeLoading[organisation.id]}
                       error={error[organisation.id]}
                       handleClickAddEmployee={handleClickAddEmployee}
                       handleClickRemoveEmployee={handleClickRemoveEmployee}
                   />
               )}
           </div>
           {organisations.length > 0 && hasNextPage &&
               <LoadableButton isLoading={loading} onClick={fetchOrganisations}>{t('load_more')}</LoadableButton>}
           {organisations.length <= 0 && <PageLoader isLoading={loading}/>}
       </>
   );
}