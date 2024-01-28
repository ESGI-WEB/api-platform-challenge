import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from '@mui/material/List';

export default function AccordionElement({
     organisation = {},
     handleClickAddEmployee,
     handleClickRemoveEmployee,
     error,
     isAddEmployeeLoading = false,
     accordionComponent: Accordion,
     accordionSummaryComponent: AccordionSummary,
     typographyComponent: Typography,
     accordionDetailsComponent: AccordionDetails,
     employeeListComponent: EmployeeList,
     addEmployeeComponent: AddEmployee
}) {

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
                <EmployeeList
                    listComponent={List}
                    listItemComponent={ListItem}
                    listItemTextComponent={ListItemText}
                    users={organisation.users}
                    organisation={organisation}
                    handleClickRemoveEmployee={handleClickRemoveEmployee}/>
                <AddEmployee error={error} isAddEmployeeLoading={isAddEmployeeLoading} organisation={organisation} handleClickAddEmployee={handleClickAddEmployee}/>
            </AccordionDetails>
        </Accordion>
    );
}