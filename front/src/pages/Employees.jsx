import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import useUserService from "../services/useUserService.js";
import useAuth from "../auth/useAuth.js";
import EmployeeCard from "../components/EmployeeCard.jsx";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const {t} = useTranslation();
    const {data} = useAuth();
    const userService = useUserService();
    const cardStyle = {
        width: '32%',
        minWidth: '240px',
    }

    useEffect(() => {
        userService.getProviderEmployees(data.id).then((employees) => {
            setEmployees(employees);
            setLoading(false);
        });
    }, []);

    return (
        <>
            <Typography variant="h1">{t('employees')}</Typography>

            <PageLoader isLoading={loading}/>

            <div className="flex flex-wrap row-gap-2 column-gap-2-percent fr-my-5v">
                {employees.map((employee) => (
                    <EmployeeCard key={employee.id} employee={employee} style={cardStyle}/>
                ))}
            </div>
        </>
    )
}