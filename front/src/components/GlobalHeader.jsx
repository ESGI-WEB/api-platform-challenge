import {Header} from "@codegouvfr/react-dsfr/Header";
import {headerFooterDisplayItem} from "@codegouvfr/react-dsfr/Display";

function GlobalHeader() {
    return (
        <>
            <Header
                brandTop="e-commissariat"
                homeLinkProps={{
                    href: '/',
                    title: 'Accueil - e-commissariat'
                }}
                id="fr-header-header-with-quick-access-items"
                quickAccessItems={[
                    {
                        iconId: 'fr-icon-add-circle-line',
                        linkProps: {
                            href: '#'
                        },
                        text: 'Se connecter'
                    },
                    headerFooterDisplayItem
                ]}
            />
        </>
    )
}

export default GlobalHeader;