import {useEffect, useState} from "react";
import PlanningHeaderDate from "./PlanningHeaderDate.jsx";
import CalendarItem from "./CalendarItem.jsx";
import PlanningColumn from "./PlanningColumn.jsx";
import Calendar from "./Calendar.jsx";
import PlanningItem from "./PlanningItem.jsx";
import {Alert, Snackbar} from "@mui/material";
import {useTranslation} from "react-i18next";
import useScheduleService from "../../services/useScheduleService.js";

export default function EmployeePlanning({
    schedules = [],
    onAddClick = void 0,
    calendarComponent : CalendarComponent = Calendar,
    calendarDateHeader : CalendarDateHeader = PlanningHeaderDate,
    calendarItem : CalendarItemComponent = PlanningItem,
    legendItem : LegendItemComponent = CalendarItem,
    calendarColumnComponent : CalendarColumnComponent = PlanningColumn,
    snackBarComponent : SnackBarComponent = Snackbar,
    snackBarMessageComponent : SnackBarMessageComponent = Alert,
}) {
    const [slots, setSlots] = useState([]);
    const [displayAllDaysBetweenDates, setDisplayAllDaysBetweenDates] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState(null);
    const {t} = useTranslation();
    const scheduleService = useScheduleService();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    useEffect(() => {
        setSlots(generateSlotsFromSchedules(schedules));
    }, [schedules]);

    const generateSlotsFromSchedules = (schedules) => {
        const slots = [];
        const today = new Date();
        const displayAllDaysBetweenDates = [];
        days.forEach((day, dayIndex) => {
            const daySchedules = schedules.filter((schedule) => schedule.day === day);

            for (const daySchedule of daySchedules) {
                // Calculate the difference in days between the current day and the target day
                const dayDifference = (dayIndex - today.getDay()) % 7 + 1;
                // Calculate the date for the target day
                const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayDifference);

                for (const hourDotsMinutes of daySchedule?.hours ?? []) {
                    const hourParts = hourDotsMinutes.split(':');
                    const hours = parseInt(hourParts[0]);
                    const minutes = parseInt(hourParts[1]);

                    slots.push({
                        datetime: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hours, minutes, 0),
                        severity: daySchedule.severity,
                        isEditable: daySchedule.isEditable,
                    });
                }
            }
        });

        // Add the day to the list of days to display
        const firstDayDifference = (days.indexOf('monday') - today.getDay()) % 7 + 1;
        const lastDayDifference = (days.indexOf('sunday') - today.getDay()) % 7 + 1;
        const firstDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + firstDayDifference);
        const lastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + lastDayDifference);
        displayAllDaysBetweenDates.push(firstDate, lastDate);

        setDisplayAllDaysBetweenDates(displayAllDaysBetweenDates);

        return slots;
    }

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
        setSnackBarMessage(null);
    }

    const handleDateClick = (data) => {
        if (!data.isEditable) {
            setOpenSnackBar(true);
            setSnackBarMessage(t('not_deletable_hour'));
            return;
        }
        const dayIndex = data.datetime.getDay() - 1 >= 0 ? data.datetime.getDay() - 1 : 6;
        const hourDotsMinutes = data.datetime.getHours().toString().padStart(2, '0') + ':' + data.datetime.getMinutes().toString().padStart(2, '0');
        const schedule = schedules.find((schedule) => schedule.day === days[dayIndex] && schedule.hours.includes(hourDotsMinutes));

        // remove hour clicked from schedule hours
        const index = schedule.hours.indexOf(hourDotsMinutes);
        if (index > -1) {
            schedule.hours.splice(index, 1);
        }

        setSlots(generateSlotsFromSchedules(schedules));

        let promise;
        if (schedule.hours.length === 0) {
            // if no more hours, delete schedule
            promise = scheduleService.delete(schedule.id);
        } else {
            promise = scheduleService.patch(schedule.id, {hours : schedule.hours});
        }

        promise.catch(() => {
            // if error, add hour back to schedule hours
            schedule.hours.push(hourDotsMinutes);
            setSlots(generateSlotsFromSchedules(schedules));
            setSnackBarMessage(t('cannot_delete_hour', {hour: hourDotsMinutes}));
        });
    }

    const handleAddClick = (data) => {
        const date = new Date(data);
        const dayIndex = date.getDay() - 1 >= 0 ? date.getDay() - 1 : 6;
        onAddClick(days[dayIndex]);
    }

    return (
        <>
            <CalendarComponent
                maxDisplayedColumns={7}
                calendarDateHeader={CalendarDateHeader}
                calendarItem={CalendarItemComponent}
                calendarColumnComponent={CalendarColumnComponent}
                data={slots}
                displayAllDaysBetweenDates={displayAllDaysBetweenDates}
                onDateClick={handleDateClick}
                onAddClick={handleAddClick}
            ></CalendarComponent>
            <div className="flex flex-row flex-wrap gap-2">
                <LegendItemComponent
                    text={t('your_stations_hours')}
                    severity="info"
                />
                <LegendItemComponent
                    text={t('other_stations_hours')}
                    severity="warning"
                />
            </div>
            <SnackBarComponent
                open={openSnackBar}
                autoHideDuration={5*1000}
                onClose={handleCloseSnackBar}
            >
                <SnackBarMessageComponent severity="error">{snackBarMessage ?? t('error_occurred')}</SnackBarMessageComponent>
            </SnackBarComponent>
        </>
    )
}