import "./calendar.css";
import {useTranslation} from "react-i18next";

export default function CalendarColumn({
    calendarItem: CalendarItemComponent,
    calendarDateHeader: CalendarDateHeaderComponent,
    day,
    calendarDates,
    onDateClick = void 0,
    disabled = false,
}) {
    const {i18n} = useTranslation();

    return (
        <div className="text-center">
            <div className="flex flex-column gap-2 align-center">
                <div>
                    <CalendarDateHeaderComponent
                        date={new Date(day)}
                    />
                </div>
                {calendarDates.map(date => (
                    <CalendarItemComponent
                        key={date.date.getTime()}
                        text={date.date.toLocaleTimeString(i18n.language, {hour: '2-digit', minute: '2-digit'})}
                        onClick={onDateClick ? () => onDateClick(date.data) : undefined}
                        severity={date.data.severity ?? 'info'}
                        disabled={disabled}
                        hoverText={date.data.hoverText}
                    />
                ))}
            </div>
        </div>
    );
}
