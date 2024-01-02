import HolidayCard from "./HolidayCard.jsx";

export default function EmployeeHolidays({
    holidays = [],
    holidayComponent: HolidayComponent = HolidayCard,
}) {
    return (
        <div className="flex flex-wrap row-gap-2 column-gap-2-percent fr-my-5v">
            {holidays.map((holiday) => (
                <HolidayComponent key={holiday.id} holiday={holiday} style={{
                    width: '32%',
                    minWidth: '240px',
                }}/>
            ))}
        </div>
    )
}