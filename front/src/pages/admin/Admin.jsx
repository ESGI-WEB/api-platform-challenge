import {useTranslation} from "react-i18next";
import CardIndicator from "../../components/CardIndicator.jsx";
import ChartIndicator from "../../components/ChartIndicator.jsx";
import InPageAlert from "../../components/InPageAlert.jsx";
import AlignItemsList from "../../components/CardList.jsx";
import TableIndicator from "../../components/TableIndicator.jsx";
import Dashboard from "../../components/Dashboard.jsx";

export default function Admin() {

    const cardIndicators = [
        {
            title: "3",
            description: "Rendez-vous enregistrés aujourd'hui",
            to: "#"
        },
        {
            title: "18",
            description: "Utilisateurs inscrits sur e-commissariat",
            to: "#"
        }
    ]

    const tableDatas =
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


    return (
        <Dashboard
            cardIndicators={cardIndicators}
            barChartData={barChartData}
            tableDatas={tableDatas}
        />
        /*<>
            <InPageAlert alert={{
                title: "Dashboard",
                description: "Bienvenue sur le dashboard de statistiques l'application e-commissariat.",
                severity: 'info',
            }} />
            <div className="flex flex-row gap-2">
                <div className="flex flex-column gap-2 flex-1">
                    <div className="flex flex-row gap-2">
                        <CardIndicator title="titre" description="description de mon indicateur blabla" to='#' />
                        <CardIndicator title="titre" description="description de mon indicateur blabla" to='#' />
                    </div>
                    <ChartIndicator />
                    <TableIndicator />
                </div>
                <div className="flex flex-row gap-2 flex-1 align-start">
                    <AlignItemsList />
                    <AlignItemsList />
                </div>
            </div>
        </>*/
    )
}