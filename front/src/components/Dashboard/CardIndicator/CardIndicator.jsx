import Card from "@codegouvfr/react-dsfr/Card.js";
import {Count, useGetList} from "react-admin";
import "./CardIndicator.css";

export default function CardIndicator({
    to,
    desc,
    resource
   }) {

    return (
        <Card
            background
            border
            desc={desc}
            horizontal
            enlargeLink
            linkProps={{
                href: {to},
            }}
            size="small"
            title={<Count resource={resource} variant="h4" />}
            titleAs="h1"
        />
    )
}