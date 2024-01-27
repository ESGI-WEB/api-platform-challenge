import {useTranslation} from "react-i18next";
import useOrganisationService from "../services/useOrganisationService.js";
import {useEffect, useState} from "react";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import AccordionElement from "../components/AccordionElement.jsx";
import InPageAlert from "../components/InPageAlert.jsx";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import EmployeeList from "../components/EmployeeList.jsx";
import AddEmployee from "../components/AddEmployee.jsx";

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
                    [organisationId]: error.message
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
                    [organisationId]: error.message
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
           <InPageAlert alert={{
               title: t('manage_teams_title'),
               description: t('manage_teams_description'),
               severity: 'info',
           }} />
           <div className="my-1">
               {organisations.map(organisation =>
                   <AccordionElement
                       key={organisation.id}
                       organisation={organisation}
                       isAddEmployeeLoading={isAddEmployeeLoading[organisation.id]}
                       error={error[organisation.id]}
                       handleClickAddEmployee={handleClickAddEmployee}
                       handleClickRemoveEmployee={handleClickRemoveEmployee}
                       accordionComponent={Accordion}
                       accordionSummaryComponent={AccordionSummary}
                       typographyComponent={Typography}
                       accordionDetailsComponent={AccordionDetails}
                       employeeListComponent={EmployeeList}
                       addEmployeeComponent={AddEmployee}
                   />
               )}
           </div>
           {organisations.length > 0 && hasNextPage &&
               <LoadableButton isLoading={loading} onClick={fetchOrganisations}>{t('load_more')}</LoadableButton>}
           {organisations.length <= 0 && <PageLoader isLoading={loading}/>}
       </>
   );
}