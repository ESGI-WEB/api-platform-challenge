import {Layout} from "react-admin";
import AppBarDashboard from "./AppBarDashboard.jsx";

export default function LayoutDashboard({...props}) {
    return (
        <Layout
            {...props}
            appBar={AppBarDashboard}
        />
    )
}