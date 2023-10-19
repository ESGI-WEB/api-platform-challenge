import Footer from "@codegouvfr/react-dsfr/Footer.js";

function GlobalFooter() {
    return (
        <>
            <Footer
                accessibility="fully compliant"
                contentDescription="
                    Ce site est un projet étudiant ayant pour but de mettre en pratique les connaissances acquises durant la formation.
                    Il ne s'agit pas d'un site officiel du gouvernement Français et n'est pas utilisé en dehors du cadre de la formation.
                "
            />
        </>
    )
}

export default GlobalFooter;