import {useTranslation} from "react-i18next";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {CardHeader, Avatar} from "@mui/material";

export default function EmployeeCard({employee, style = {}, clickable = true}) {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const goToEmployee = () => {
        navigate(`/employees/${employee.id}`);
    }

    if (clickable) {
        style = {
            ...style,
            cursor: 'pointer'
        }
    }

    return (
        <Card variant="outlined" sx={style} onClick={clickable ? goToEmployee : undefined}>
            <CardHeader
                avatar={
                    <Avatar>
                        {employee.firstname[0]}{employee.lastname[0]}
                    </Avatar>
                }
                title={`${employee.firstname} ${employee.lastname}`}
                subheader={employee.email}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {t('number_stations', {count: employee.countOrganisations ?? 0})}
                </Typography>
            </CardContent>
        </Card>
    )
}