import {Header} from "@codegouvfr/react-dsfr/Header";
import {useTranslation} from "react-i18next";

export default function GlobalHeader({
  brandTop = null,
  homeLinkProps = {
      to: '/',
      title: 'Accueil - e-commissariat',
  },
  id = "fr-header-header-with-quick-access-items",
  quickAccessItems = [],
  serviceTitle = '',
  navigation = [],
}) {
    const { t } = useTranslation();

    brandTop = brandTop ?? t("headerBrandTop");

    return (
        <Header
            brandTop={brandTop}
            serviceTitle={serviceTitle}
            homeLinkProps={homeLinkProps}
            id={id}
            quickAccessItems={quickAccessItems}
            navigation={navigation}
        />
    )
}