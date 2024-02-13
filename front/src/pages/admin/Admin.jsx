import Dashboard from "../../components/Dashboard.jsx";
import useStatisticsService from "../../services/useStatisticsService.js";
import {useEffect, useState} from "react";
import InPageAlert, {AlertSeverity} from "../../components/InPageAlert.jsx";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import {useTranslation} from "react-i18next";
import CardIndicator from "../../components/CardIndicator.jsx";
import ChartIndicator from "../../components/ChartIndicator.jsx";
import CardListIndicator from "../../components/CardListIndicator.jsx";
import TableIndicator from "../../components/TableIndicator.jsx";

export default function Admin() {
    const {t, i18n} = useTranslation();
    const [stats, setStats] = useState({
        isLoading: true,
        isErrored: false,
        appointmentsCount: null,
        appointmentSlot: null,
        lastAppointments: null,
        maxOrganisations: null,
        appointmentsPerDay: null,
        lastFeedbacks: null,
    });

    const statisticsService = useStatisticsService();

    const loadStatistics = async () => {
        setStats((prevStats) => ({...prevStats, isLoading: true}));

        try {
            const [
                appointmentsCount,
                appointmentSlot,
                appointmentSlotsByHours,
                lastAppointments,
                maxOrganisations,
                appointmentsPerDay,
                lastFeedbacks,
            ] = await Promise.all([
                statisticsService.getAppointmentsCount(),
                statisticsService.getMaxAppointmentSlot(),
                statisticsService.getMostPopularSlotByHours(),
                statisticsService.getLastAppointments(),
                statisticsService.getMaxOrganisations(),
                statisticsService.getAppointmentsPerDay(),
                statisticsService.getLastFeedback(),
            ]);

            setStats((prevStats) => ({
                ...prevStats,
                appointmentsCount,
                appointmentSlot,
                appointmentSlotsByHours,
                lastAppointments,
                maxOrganisations,
                appointmentsPerDay,
                lastFeedbacks,
            }));
        } catch (e) {
            console.error(e);
            setStats((prevStats) => ({...prevStats, isErrored: true}));
        } finally {
            setStats((prevStats) => ({...prevStats, isLoading: false}));
        }
    };

    useEffect(() => {
        loadStatistics();
    }, []);

    if (stats.isErrored) {
        return <InPageAlert alert={{severity: AlertSeverity.ERROR, closable: false}}/>;
    } else if (stats.isLoading) {
        return <PageLoader isLoading={stats.isLoading}/>;
    }

    const formatDate = (date) =>
        new Date(date).toLocaleString(i18n.language, {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });

    // time is on format "HH:MM +00"
    const formatTime = (time) => {
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${time}`;
        return new Date(dateString).toLocaleTimeString(i18n.language, {
            hour: "numeric",
            minute: "numeric",
        });
    }

    const cardIndicators = [
        {
            value: stats.appointmentsCount.count,
            description: t("appointments_count"),
            to: "#",
        },
        {
            value: stats.appointmentSlot?.time ? formatTime(stats.appointmentSlot.time) : t('no_result'),
            description: t("max_appointment_slot"),
            to: "#",
        },
    ];

    const tableData = {
        title: t("last_feedbacks"),
        tableColumns: Object.keys(stats.lastFeedbacks[0] ?? {}).map((key) => t(key)),
        rows: stats.lastFeedbacks.map((feedback) => ({
            ...feedback,
            appointment_date: formatDate(feedback.appointment_date),
            feedback_date: formatDate(feedback.feedback_date),
        })),
    };

    const days = Array.from(Array(7).keys()).map((idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (d.getDay() + 6) % 7 + idx);
        return d;
    });

    const barChartDatas = [
        {
            title: t("appointments_per_day_title"),
            xAxis: days.map((d) =>
                new Date(d).toLocaleDateString(i18n.language, {
                    day: "numeric",
                    month: "long",
                })
            ),
            series: [
                {
                    data: stats.appointmentsPerDay,
                    color: "var(--blue-france-sun-113-625)",
                },
            ],
            width: 500,
            height: 300,
        },
        {
            title: t("appointment_slots_by_hours"),
            xAxis: stats.appointmentSlotsByHours.map((slot) => formatTime(slot.hour)),
            series: [
                {
                    data: stats.appointmentSlotsByHours.map((slot) => slot.count),
                    color: "var(--blue-france-sun-113-625)",
                },
            ],
            width: 500,
            height: 300,
        },
    ];

    const listsData = [
        {
            title: t("appointments_booked_today_title"),
            description: t("appointments_booked_today_description"),
            to: "#",
            rows: stats.lastAppointments,
            variant: "variant1",
        },
        {
            title: t("max_appointments_title"),
            description: t("max_appointments_description"),
            to: "#",
            rows: stats.maxOrganisations,
            variant: "variant2",
        },
    ];

    return (
        <Dashboard
            cardIndicators={cardIndicators}
            barChartDatas={barChartDatas}
            tableData={tableData}
            listsData={listsData}
            cardIndicatorComponent={CardIndicator}
            chartIndicatorComponent={ChartIndicator}
            tableIndicatorComponent={TableIndicator}
            cardListIndicatorComponent={CardListIndicator}
        />
    );
}