import "./calendar.css";
import {useEffect, useState} from "react";

export default function Calendar({
    component: Component = "div",
    calendarItem: CalendarItemComponent,
    calendarDateHeader: CalendarDateHeaderComponent,
    data = [],
    dateTimePath = "datetime",
    maxDisplayedColumns = 6,
    onDateClick = void 0,
    displayAllDaysBetweenDates = [],
}) {
    const [dates, setDates] = useState([]);
    const [displayedChunk, setDisplayedChunk] = useState(0);

    const getDateTimeFromObject = (obj) => {
        const path = dateTimePath.split('.');
        let value = obj;
        for (let i = 0; i < path.length; i++) {
            if (path[i] in value) {
                value = value[path[i]];
            } else {
                return null;
            }
        }
        return new Date(value);
    }

    const groupDatetimesByDay = () => {
        const grouped = {};

        // check if startDate and endDate are set, if so, display also columns between those dates
        if (displayAllDaysBetweenDates.length) {
            if (displayAllDaysBetweenDates.length !== 2) {
                throw new Error('displayAllDaysBetweenDays must be an array of two dates');
            }
            const [startDate, endDate] = displayAllDaysBetweenDates;
            // for each day between startDate and endDate, check if it's already in the calendar otherwise add it
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const dayStr = currentDate.toDateString();
                if (!(dayStr in grouped)) {
                    grouped[dayStr] = [];
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        // group datetimes by day
        data.forEach((obj) => {
            const day = getDateTimeFromObject(obj);
            if (day === null) {
                return;
            }
            const dayStr = day.toDateString();
            if (!(dayStr in grouped)) {
                grouped[dayStr] = [];
            }
            grouped[dayStr].push({
                date: day,
                data: obj
            });
        });

        // order every day's datetimes by time
        Object.keys(grouped).forEach((day) => {
            grouped[day].sort((a, b) => a.date.getTime() - b.date.getTime());
        });

        return grouped;
    }

    const changeChunk = (delta) => {
        if (displayedChunk + delta < 0 || displayedChunk + delta >= dates.length) {
            return;
        }
        setDisplayedChunk(displayedChunk + delta);
    }

    useEffect(() => {
        const dates = groupDatetimesByDay();
        // chunk dates by maxDisplayedColumns days
        let chunkedDates = Object.entries(dates).reduce((acc, [dayStr, calendarDates]) => {
            const lastChunk = acc[acc.length - 1];

            if (lastChunk.length < maxDisplayedColumns) {
                lastChunk.push([dayStr, calendarDates]);
            } else {
                acc.push([[dayStr, calendarDates]]);
            }
            return acc;
        }, [[]]);

        setDates([...chunkedDates]);
    }, [data]);

    return (
        <Component className="calendar">
            {dates.length > 0 && <>
                {displayedChunk > 0 &&
                    <i className="ri-arrow-left-circle-line left-calendar-arrow pointer"
                       onClick={() => changeChunk(-1)}
                    ></i>
                }
                {dates[displayedChunk].map(([day, calendarDates]) => (
                    <div key={day} className="text-center">
                        <CalendarDateHeaderComponent
                            date={new Date(day)}
                        />
                        <div className="flex flex-column gap-2 align-center">
                            {calendarDates.map(date => (
                                <CalendarItemComponent
                                    key={date.date.getTime()}
                                    date={date.date}
                                    onClick={onDateClick ? () => onDateClick(date.data) : undefined}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                {displayedChunk < dates.length - 1 &&
                    <i className="ri-arrow-right-circle-line right-calendar-arrow pointer"
                       onClick={() => changeChunk(1)}
                    ></i>
                }
            </>}
        </Component>
    );
}
