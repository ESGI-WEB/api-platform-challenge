import Dashboard from "../../components/Dashboard.jsx";
import useStatisticsService from "../../services/useStatisticsService.js";
import {useEffect, useState} from "react";
import InPageAlert, {AlertSeverity} from "../../components/InPageAlert.jsx";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import {useTranslation} from "react-i18next";

export default function Admin() {
    const {t, i18n} = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const [appointmentsCount, setAppointmentsCount] = useState(null);
    const [appointmentSlot, setAppointmentSlot] = useState(null);
    const [lastAppointments, setLastAppointments] = useState(null);
    const [maxOrganisations, setMaxOrganisations] = useState(null);
    const [appointmentsPerDay, setAppointmentsPerDay] = useState(null);
    const [lastFeedbacks, setLastFeedbacks] = useState(null);

    const statisticsService = useStatisticsService();

    const loadStatistics = () => {
        setIsLoading(true);

        Promise.all([
            statisticsService.getAppointmentsCount(),
            statisticsService.getMaxAppointmentSlot(),
            statisticsService.getLastAppointments(),
            statisticsService.getMaxOrganisations(),
            statisticsService.getAppointmentsPerDay(),
            statisticsService.getLastFeedback(),
        ]).then(([appointmentsCount, appointmentSlot, lastAppointments, maxOrganisations, appointmentsPerDay, lastFeedbacks]) => {
            setAppointmentsCount(appointmentsCount);
            setAppointmentSlot(appointmentSlot);
            setLastAppointments(lastAppointments);
            setMaxOrganisations(maxOrganisations);
            setAppointmentsPerDay(appointmentsPerDay);
            setLastFeedbacks(lastFeedbacks);
        }).catch((e) => {
            console.error(e);
            setIsErrored(true);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        loadStatistics()
    }, []);

    if (isErrored) {
        return <InPageAlert alert={{severity: AlertSeverity.ERROR, closable: false}}/>;
    }

    if (isLoading) {
        return <PageLoader isLoading={isLoading}/>;
    }

    const cardIndicators = [
        {
            value: appointmentsCount.count,
            description: t('appointments_count'),
            to: "#"
        },
        {
            value: new Date(appointmentSlot.time).toLocaleTimeString(i18n.language, {
                hour: "numeric",
                minute: "numeric",
            }),
            description: t('max_appointment_slot'),
            to: "#"
        }
    ]

    const tableData = {
        title: t('last_feedbacks'),
        tableColumns: Object.keys(lastFeedbacks[0]).map((key) => t(key)),
        rows: lastFeedbacks.map((feedback) => ({
            ...feedback,
            appointment_date: new Date(feedback.appointment_date).toLocaleString(i18n.language, {
                day: "numeric",
                month: "numeric",
                year: "numeric",
            }),
            feedback_date: new Date(feedback.feedback_date).toLocaleString(i18n.language, {
                day: "numeric",
                month: "numeric",
                year: "numeric",
            }),
        })),
    };

    const days = Array.from(Array(7).keys()).map((idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (d.getDay() + 6) % 7 + idx);
        return d;
    });

    const barChartData =
        {
            title: t('appointments_per_day_title'),
            xAxis: days.map((d) => {
                return new Date(d).toLocaleDateString(i18n.language, {
                    day: "numeric",
                    month: "long",
                })
            }),
            series: [
                {
                    data: appointmentsPerDay,
                    color: "var(--blue-france-sun-113-625)",
                },
            ],
            width: 500,
            height: 300,
        }

    const listsData = [
        {
            title: t('appointments_booked_today_title'),
            description: t('appointments_booked_today_description'),
            to: '#',
            rows: lastAppointments,
            variant: 'variant1'
        },
        {
            title: t('max_appointments_title'),
            description: t('max_appointments_description'),
            to: '#',
            rows: maxOrganisations,
            variant: 'variant2'
        }
    ]

    return (
        <Dashboard
            cardIndicators={cardIndicators}
            barChartData={barChartData}
            tableData={tableData}
            listsData={listsData}
        />
    )
}