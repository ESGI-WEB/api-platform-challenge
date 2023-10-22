import {Header} from "@codegouvfr/react-dsfr/Header";
import {headerFooterDisplayItem} from "@codegouvfr/react-dsfr/Display";

export default function GlobalHeader({
  brandTop = "e-commissariat",
  homeLinkProps = {
      to: '/',
      title: 'Accueil - e-commissariat',
  },
  id = "fr-header-header-with-quick-access-items",
  quickAccessItems = [],
  serviceTitle = '',
}) {
    return (
        <Header
            brandTop={brandTop}
            serviceTitle={serviceTitle}
            homeLinkProps={homeLinkProps}
            id={id}
            quickAccessItems={[...quickAccessItems, headerFooterDisplayItem]}
        />
    )
}