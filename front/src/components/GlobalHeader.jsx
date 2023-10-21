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
}) {
    return (
        <Header
            brandTop={brandTop}
            homeLinkProps={homeLinkProps}
            id={id}
            quickAccessItems={[...quickAccessItems, headerFooterDisplayItem]}
        />
    )
}