import LocalStorageBackend from 'i18next-localstorage-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import Backend from 'i18next-chained-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: true,
        backend: {
            backends: [
                HttpApi
            ],
            backendOptions: [
                {
                    loadPath: 'http://localhost:8888/api/translations'
                }
            ],
        },
    });

export default i18n;
