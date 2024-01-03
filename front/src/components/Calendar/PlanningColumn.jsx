import "./calendar.css";
import CalendarColumn from "./CalendarColumn.jsx";
import CalendarItem from "./CalendarItem.jsx";
import {useTranslation} from "react-i18next";

export default function PlanningColumn({
    calendarItem: CalendarItemComponent,
    calendarDateHeader: CalendarDateHeaderComponent,
    columnComponent: CalendarColumnComponent = CalendarColumn,
    day,
    calendarDates,
    onDateClick = void 0,
    onAddClick = void 0,
    addText = null,
    disabled = false,
}) {
    const {t} = useTranslation();
    return (
        <div className="flex flex-column gap-2">
            <CalendarColumnComponent
                key={day}
                calendarDateHeader={CalendarDateHeaderComponent}
                calendarItem={CalendarItemComponent}
                onDateClick={onDateClick}
                day={day}
                calendarDates={calendarDates}
                disabled={disabled}
            />
            {!disabled &&
                <CalendarItem
                    text={addText ?? t('add')}
                    onClick={onAddClick ? () => onAddClick(day) : undefined}
                    severity={undefined}
                />
            }
        </div>
    );
}
