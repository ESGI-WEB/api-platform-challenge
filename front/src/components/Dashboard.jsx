import InPageAlert from "./InPageAlert.jsx";
import {useTranslation} from "react-i18next";

export default function Dashboard({
    cardIndicators = [],
    barChartData = {},
    tableData = {},
    listsData = [],
    cardIndicatorComponent: CardIndicator,
    chartIndicatorComponent: ChartIndicator,
    tableIndicatorComponent: TableIndicator,
    cardListIndicatorComponent: CardListIndicator,
}) {

    const {t} = useTranslation();

    return (
        <>
            <InPageAlert alert={{
                title: t('dashboard_title'),
                description: t('dashboard_description'),
                severity: 'info',
            }} />
            <div className="flex flex-row gap-2">
                <div className="flex flex-column gap-2 flex-1">
                    <div className="flex flex-row gap-2">
                        {cardIndicators.map((indicator, index) =>
                            <CardIndicator key={index} title={indicator.value} description={indicator.description} to={indicator.to} />
                        )}
                    </div>
                    <ChartIndicator data={barChartData} />
                    <TableIndicator data={tableData}/>
                </div>
                <div className="flex flex-row gap-2 flex-1 align-start">
                    {listsData.map(list =>
                        <CardListIndicator key={list.title} title={list.title} description={list.description} list={list.rows} variant={list.variant}/>
                    )}
                </div>
            </div>
        </>
    )
}