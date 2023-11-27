import "./calendar.css";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import {useEffect, useState} from "react";
import {createModal} from "@codegouvfr/react-dsfr/Modal";

export default function Calendar({
     component: Component = "div",
     data = [],
     dateTimePath = "datetime",
     maxDisplayedColumns = 6,
     onDateClick = () => {
     }
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
        // chunk dates by 6 days
        const chunkedDates = Object.entries(dates).reduce((acc, [dayStr, calendarDates]) => {
            const lastChunk = acc[acc.length - 1];

            if (lastChunk.length < maxDisplayedColumns) {
                lastChunk.push([dayStr, calendarDates]);
            } else {
                acc.push([[dayStr, calendarDates]]);
            }
            return acc;
        }, [[]]);
        setDates(chunkedDates);
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
                        <p className="margin-0">{calendarDates[0].date.toLocaleDateString(undefined, {weekday: 'long'})}</p>
                        <p className="fr-mb-5v">
                            <small>{calendarDates[0].date.toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'short'
                            })}</small>
                        </p>
                        <div className="flex flex-column gap-2 align-center">
                            {calendarDates.map(date => (
                                <Badge key={date.date} noIcon
                                       severity="info"
                                       className="pointer"
                                       onClick={() => onDateClick(date.data)}
                                >
                                    {date.date.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
                                </Badge>
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
