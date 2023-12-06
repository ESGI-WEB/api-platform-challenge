import {useTranslation} from "react-i18next";
import CardIndicator from "../../components/CardIndicator.jsx";
import ChartIndicator from "../../components/ChartIndicator.jsx";
import InPageAlert from "../../components/InPageAlert.jsx";
import AlignItemsList from "../../components/ListIndicator.jsx";
import TableIndicator from "../../components/TableIndicator.jsx";

export default function Admin() {

    const { t} = useTranslation();

    return (
        <>
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
        </>
    )
}