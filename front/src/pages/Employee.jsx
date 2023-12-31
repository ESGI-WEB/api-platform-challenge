import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import PageLoader from "../components/PageLoader/PageLoader.jsx";
import useUserService from "../services/useUserService.js";
import useAuth from "../auth/useAuth.js";
import EmployeeCard from "../components/EmployeeCard.jsx";
import {useParams} from "react-router-dom";
import Calendar from "../components/Calendar/Calendar.jsx";
import CalendarHeaderDate from "../components/Calendar/CalendarHeaderDate.jsx";
import CalendarItem from "../components/Calendar/CalendarItem.jsx";
import PlanningHeaderDate from "../components/Calendar/PlanningHeaderDate.jsx";

export default function Employee() {
    const {employeeId} = useParams();
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const {t} = useTranslation();
    const {data} = useAuth();
    const userService = useUserService();
    const [slots, setSlots] = useState([]);
    const [displayAllDaysBetweenDates, setDisplayAllDaysBetweenDates] = useState([]);

    useEffect(() => {
        userService.getUser(employeeId).then((res) => {
            setLoading(false);
            setEmployee(res)
            setSlots(generateSlotsFromSchedules(res.schedules));
        });
    }, []);

    const generateSlotsFromSchedules = (schedules) => {
        const slots = [];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const today = new Date();
        const displayAllDaysBetweenDates = [];
        days.forEach((day, dayIndex) => {
            const daySchedule = schedules.find((schedule) => schedule.day === day);

            // Calculate the difference in days between the current day and the target day
            const dayDifference = (dayIndex - today.getDay() + 7) % 7 + 1;
            // Calculate the date for the target day
            const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayDifference);

            for (const hourDotsMinutes of daySchedule?.hours ?? []) {
                const hourParts = hourDotsMinutes.split(':');
                const hours = parseInt(hourParts[0]);
                const minutes = parseInt(hourParts[1]);

                slots.push({
                    datetime: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hours, minutes, 0),
                });
            }

            // Add the day to the list of days to display
            if (dayIndex === 0 || dayIndex === 6) {
                // If the day is a weekend, add it to the list of days to display
                displayAllDaysBetweenDates.push(targetDate);
            }
        });
        setDisplayAllDaysBetweenDates(displayAllDaysBetweenDates);

        return slots;
    }


    if (loading) {
        return <PageLoader isLoading={loading}/>
    }

    return (
        <div className="flex flex-column gap-2">
            <EmployeeCard employee={employee} clickable={false}/>

            <Typography variant="h2" gutterBottom>
                Planning
            </Typography>


            <Calendar
                maxDisplayedColumns={7}
                calendarDateHeader={CalendarHeaderDate}
                calendarItem={CalendarItem}
                data={slots}
                displayAllDaysBetweenDates={displayAllDaysBetweenDates}
            ></Calendar>


        </div>
    )
}