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
            title: "Liste des 5 derniers rendez-vous enregistrés",
            description: "description de mon indicateur blabla",
            to: '#',
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
        },
        {
            title: "Liste des 5 derniers rendez-vous enregistrés",
            description: "description de mon indicateur blabla",
            to: '#',
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
                }
            ],
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