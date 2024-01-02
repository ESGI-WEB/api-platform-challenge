import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

export default function HolidayCard({
    holiday,
    style = {},
}) {
    const {t, i18n} = useTranslation();
    style = {
        ...style,
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(i18n.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const getHolidayDuration = (holiday) => {
        // get holiday duration expressed in days, hours and minutes
        const duration = Math.abs(new Date(holiday.datetimeEnd) - new Date(holiday.datetimeStart));
        const days = Math.floor(duration / (1000 * 60 * 60 * 24));
        const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        const dayShort = t('day_short');
        const hourShort = t('hour_short');
        const minuteShort = t('minute_short');

        if (days >= 2) {
            return `${days}${dayShort}`;
        }

        else if (days === 1) {
            return `${days}${dayShort} ${hours}${hourShort} ${minutes}${minuteShort}`;
        }

        return `${hours}${hourShort} ${minutes}${minuteShort}`;
    }

    return (
        <Card variant="outlined" sx={style}>
            <CardContent>
                <Divider>
                    <div className="flex flex-row gap-1">
                        <i className="ri-suitcase-2-line"></i>
                        <Typography gutterBottom>
                            {getHolidayDuration(holiday)}
                        </Typography>
                    </div>
                </Divider>
                <Typography gutterBottom>
                    {t('from')} {formatDate(holiday.datetimeStart)}
                </Typography>
                <Typography gutterBottom>
                    {t('to')} {formatDate(holiday.datetimeEnd)}
                </Typography>
                <Typography gutterBottom>
                    {t('police_station')} {holiday.organisation.name}
                </Typography>
                <Typography gutterBottom>
                    <small>{t('asked_on', {date: formatDate(holiday.createdAt)})}</small>
                </Typography>
            </CardContent>
        </Card>
    )
}