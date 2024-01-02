import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import useUserService from "../services/useUserService.js";
import EmployeeCard from "../components/EmployeeCard.jsx";
import {useParams} from "react-router-dom";
import EmployeePlanning from "../components/Calendar/EmployeePlanning.jsx";
import {useTranslation} from "react-i18next";
import useAuth from "../auth/useAuth.js";
import EmployeeHolidays from "../components/EmployeeHolidays.jsx";
import Modal from "../components/Modal/Modal.jsx";
import SchedulesForm from "../components/SchedulesForm.jsx";
import useScheduleService from "../services/useScheduleService.js";
import {Alert, Snackbar} from "@mui/material";

export default function Employee() {
    const {data} = useAuth();
    const {employeeId} = useParams();
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [currentProvider, setCurrentProvider] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const userService = useUserService();
    const {t} = useTranslation();
    const [editSchedulesForDay, setEditSchedulesForDay] = useState(null);
    const scheduleService = useScheduleService();
    const [openSnackBar, setOpenSnackBar] = useState(false);

    useEffect(() => {
        loadPage();
    }, []);

    const loadPage = () => {
        setLoading(true);
        const promises = Promise.all([
            userService.getUser(employeeId),
            currentProvider ? Promise.resolve(currentProvider) : userService.getUser(data.id)
        ]);

        promises.then(([employee, currentProvider]) => {
            setEmployee(employee);
            setCurrentProvider(currentProvider);
            fillSchedulesWithRights(currentProvider, employee.schedules ?? []);
            setLoading(false);
        });
    }

    const fillSchedulesWithRights = (currentProvider, schedules) => {
        // we have to check if current provider also has organisation rights belonging to the schedule, otherwise he can't edit it
        const schedulesWithRights = schedules.map((schedule) => {
            schedule.isEditable = currentProvider.organisations.some((organisation) => organisation.id === schedule.organisation.id);
            schedule.severity = schedule.isEditable ? 'info' : 'warning';
            return schedule;
        });

        setSchedules(schedulesWithRights);
    }

    const handleSaveHours = (day, hours, organisation) => {
        const schedule = schedules.find((schedule) =>
            schedule.day === day &&
            schedule.organisation.id === organisation.id
        );

        let promise;
        if (schedule) {
            // merge if schedule already exists
            promise = scheduleService.patch(schedule.id, {
                hours: [...new Set([...schedule.hours, ...hours])]
            });
        } else {
            // create if no schedule for this day and organisation exists
            promise = scheduleService.post({
                day,
                hours,
                provider: `/api/users/${employeeId}`,
                organisation: `/api/organisations/${organisation.id}`
            });
        }

        return promise.then(() => {
            setEditSchedulesForDay(null);
            loadPage();
        }).catch(() => {
            setOpenSnackBar(true);
        });
    }

    if (loading) {
        return <PageLoader isLoading={loading}/>
    }

    return (
        <div className="flex flex-column gap-3">
            <EmployeeCard employee={employee} clickable={false}/>

            <div>
                <Typography variant="h2" gutterBottom>
                    {t('default_planning')}
                </Typography>

                <EmployeePlanning schedules={schedules} onAddClick={(day) => setEditSchedulesForDay(day)}/>
            </div>
            <div>
                <Typography variant="h2" gutterBottom>
                    {t('holidays')}
                </Typography>

                <EmployeeHolidays holidays={employee.holidays}/>
            </div>

            {editSchedulesForDay !== null &&
                <Modal
                    onClose={() => setEditSchedulesForDay(null)}
                    title={t('add_hours_for_day', {day: t(editSchedulesForDay)})}
                >
                    <SchedulesForm
                        onSubmit={({hours, organisation}) => handleSaveHours(editSchedulesForDay, hours, organisation)}
                        organisations={currentProvider.organisations}
                        day={editSchedulesForDay}
                        unavailabilities={schedules.flatMap((schedule) => !schedule.isEditable && schedule.day === editSchedulesForDay ? schedule.hours : [])}
                    />
                </Modal>
            }

            <Snackbar
                open={openSnackBar}
                autoHideDuration={5 * 1000}
                onClose={() => setOpenSnackBar(false)}
            >
                <Alert severity="error">{t('error_occurred')}</Alert>
            </Snackbar>
        </div>
    )
}