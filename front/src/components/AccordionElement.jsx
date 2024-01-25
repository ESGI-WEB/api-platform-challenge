import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import EmployeeList from "./EmployeeList.jsx";
import AddEmployee from "./AddEmployee.jsx";
export default function AccordionElement({organisation, handleClickAddEmployee}) {

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<span className="fr-icon-arrow-down-s-line" aria-hidden="true"></span>}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {organisation.name}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{`${organisation.zipcode} ${organisation.city}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <EmployeeList users={organisation.users}/>
                <AddEmployee organisation={organisation} handleClickAddEmployee={handleClickAddEmployee}/>
            </AccordionDetails>
        </Accordion>
    );
}