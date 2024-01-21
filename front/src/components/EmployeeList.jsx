import {useTranslation} from "react-i18next";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
export default function EmployeeList({users}) {
    const {t} = useTranslation();

    return (
        <List>
            {users.length === 0 && <ListItemText primary={t('no_employee')}/>}
            {users.map(user =>
                <ListItem
                    key={user.id}
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                            supprimer
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