import Dashboard from "../../components/Dashboard.jsx";
import useStatisticsService from "../../services/useStatisticsService.js";
import {useEffect, useState} from "react";
import InPageAlert, {AlertSeverity} from "../../components/InPageAlert.jsx";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import {useTranslation} from "react-i18next";

export default function Admin() {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const [appointmentsCount, setAppointmentsCount] = useState(null);
    const [appointmentSlot, setAppointmentSlot] = useState(null);
    const [lastAppointments, setLastAppointments] = useState(null);

    const statisticsService = useStatisticsService();

    const loadStatistics = () => {
        setIsLoading(true);

        Promise.all([
            statisticsService.getAppointmentsCount(),
            statisticsService.getMaxAppointmentSlot(),
            statisticsService.getLastAppointments()
        ]).then(([appointmentsCount, appointmentSlot, lastAppointments]) => {
            setAppointmentsCount(appointmentsCount);
            setAppointmentSlot(appointmentSlot);
            setLastAppointments(lastAppointments);
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
            value: appointmentSlot.time,
            description: t('max_appointment_slot'),
            to: "#"
        }
    ]

    const tableData =
        {
            title: "Liste des 5 derniers rendez-vous enregistrés",
            tableColumns: ["nom", "prénom", "date", "commissariat"],
            rows: [
                {
                    name: "MORIN",
                    firstName: "Laurie",
                    date: "15 décembre",
                    commissariat: "Commissariat 18ème",
                },
                {
                    name: "MORIN",
                    firstName: "Laurie",
                    date: "15 décembre",
                    commissariat: "Commissariat 18ème",
                },
                {
                    name: "MORIN",
                    firstName: "Laurie",
                    date: "15 décembre",
                    commissariat: "Commissariat 18ème",
                },
                {
                    name: "MORIN",
                    firstName: "Laurie",
                    date: "15 décembre",
                    commissariat: "Commissariat 18ème",
                },
                {
                    name: "MORIN",
                    firstName: "Laurie",
                    date: "15 décembre",
                    commissariat: "Commissariat 18ème",
                }
            ],
        }

    const barChartData =
        {
            title: "Nombre de rendez-vous enregistrés par jour",
            xAxis: ["Lundi 1", "Mardi 2", "Mercredi 3", "Jeudi 4", "Vendredi 5"],
            series: [
                {
                    data: [2, 5, 2, 8, 3],
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
        },
        {
            title: "Liste des 5 derniers rendez-vous enregistrés",
            description: "description de mon indicateur blabla",
            to: '#',
            rows: lastAppointments
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