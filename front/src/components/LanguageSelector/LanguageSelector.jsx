import {useTranslation} from "react-i18next";
import './LanguageSelector.css';

export default function LanguageSelector() {
    const {i18n, t} = useTranslation();

    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    const languages = [
        {code: "fr", label: "FR - Français"},
        {code: "en", label: "EN - English"},
    ];

    return (
        <nav role="navigation" className="fr-translate fr-nav">
            <div className="fr-nav__item fr-translate fr-nav">
                <button className="fr-translate__btn fr-mb-0 fr-btn--tertiary" aria-controls="translate-1177"
                        aria-expanded="false" title={t('select_language')}>
                    {i18n.language === "fr" ? "FR" : "EN"}
                    <span className="fr-hidden-lg">
                        {i18n.language === "fr" ? " - Français" : " - English"}
                    </span>
                </button>
                <div className="fr-collapse fr-translate__menu fr-menu" id="translate-1177">
                    <ul className="fr-menu__list">
                        {languages.map((language) => (
                            <li key={language.code}
                                className={`fr-translate__language fr-nav__link ${
                                    i18n.language === language.code ? "current-language" : ""
                                }`}
                                lang={language.code}
                                aria-current={i18n.language === language.code ? "true" : null}
                                onClick={() => changeLanguage({target: {value: language.code}})}
                            >
                                {language.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}