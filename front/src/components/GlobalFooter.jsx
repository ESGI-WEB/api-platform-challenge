import Footer from "@codegouvfr/react-dsfr/Footer.js";
import {headerFooterDisplayItem} from "@codegouvfr/react-dsfr/Display";
import {useTranslation} from "react-i18next";

export default function GlobalFooter({
  accessibility = "fully compliant",
  contentDescription,
  bottomItems= [
    headerFooterDisplayItem,
  ],
}) {
    const {t} = useTranslation();
    const defaultContentDescription = t('footerDescription');

    return (
        <Footer
            accessibility={accessibility}
            contentDescription={contentDescription ?? defaultContentDescription}
            bottomItems={bottomItems}
        />
    )
}