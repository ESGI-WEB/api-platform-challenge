import CardIndicator from "../CardIndicator/CardIndicator.jsx";
import "./MainDashboard.css";
import {useTranslation} from "react-i18next";
import CustomTable from "../CustomTable.jsx";

export default function MainDashboard() {
    const {t} = useTranslation();

    return (
        <div className="padding">
            <div
                className="container flex-container"
            >
                <CardIndicator to={"appointments"} resource={"appointments"} desc={t("descriptionAppointmentsIndicator")}/>
                <CardIndicator to={"users"} resource={"users"} desc={t("descriptionUsersIndicator")}/>
                <CardIndicator to={"users"} resource={"users"} desc={t("descriptionAppointmentsIndicator")}/>
            </div>
            <CustomTable />
        </div>
    )
}