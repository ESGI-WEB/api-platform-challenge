import {useTranslation} from "react-i18next";
import IconButton from '@mui/material/IconButton';
export default function EmployeeList({
     users = [],
     organisation = {},
     handleClickRemoveEmployee,
    listComponent: List,
    listItemComponent: ListItem,
    listItemTextComponent: ListItemText,
}) {
    const {t} = useTranslation();

    return (
        <List>
            {users.length === 0 && <ListItemText primary={t('no_employee')}/>}
            {users.map(user =>
                <ListItem
                    key={user.email}
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleClickRemoveEmployee(organisation.id, user.id)}>
                            <span className="fr-icon-delete-fill" aria-hidden="true"></span>
                        </IconButton>
                    }
                >
                    <ListItemText
                        primary={`${user.firstname} ${user.lastname}`}
                        secondary={user.email}
                    />
                </ListItem>
            )}
        </List>
    );
}