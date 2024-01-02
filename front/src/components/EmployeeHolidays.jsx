import HolidayCard from "./HolidayCard.jsx";
import HolidaysCardForm from "./HolidaysCardForm.jsx";

export default function EmployeeHolidays({
    employeeId,
    holidays = [],
    holidayComponent: HolidayComponent = HolidayCard,
    formComponent: FormComponent = HolidaysCardForm,
    withForm = false,
    organisations = [],
    onNewHoliday = void 0,
    onDeletedHoliday = void 0
}) {
    const cardStyle = {
        width: '32%',
        minWidth: '240px',
    }

    return (
        <div className="flex flex-wrap row-gap-2 column-gap-2-percent fr-my-5v">
            {withForm && <FormComponent style={cardStyle} organisations={organisations} onNewHoliday={onNewHoliday} employeeId={employeeId}/>}
            {holidays.map((holiday) => (
                <HolidayComponent key={holiday.id} holiday={holiday} style={cardStyle} onDeletedHoliday={onDeletedHoliday}/>
            ))}
        </div>
    )
}