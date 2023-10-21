import Footer from "@codegouvfr/react-dsfr/Footer.js";
import {headerFooterDisplayItem} from "@codegouvfr/react-dsfr/Display";

export default function GlobalFooter({
  accessibility = "fully compliant",
  contentDescription,
  bottomItems= [
    headerFooterDisplayItem,
  ],
}) {
    const defaultContentDescription = `
        Ce site est un projet étudiant ayant pour but de mettre en pratique les connaissances acquises durant la formation.
        Il ne s'agit pas d'un site officiel du gouvernement Français et n'est pas utilisé en dehors du cadre de la formation.
    `;

    return (
        <Footer
            accessibility={accessibility}
            contentDescription={contentDescription ?? defaultContentDescription}
            bottomItems={bottomItems}
        />
    )
}