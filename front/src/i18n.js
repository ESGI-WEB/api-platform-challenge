import LocalStorageBackend from 'i18next-localstorage-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import Backend from 'i18next-chained-backend';

const baseUrl = import.meta.env.VITE_API_ENDPOINT;
const supportedLanguages = ['en', 'fr'];

i18n.failedLoadings = [];
i18n.on('failedLoading', (lng) => {
    i18n.failedLoadings.push(lng);
});

i18n
    .use(Backend)
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        order: ['navigator'],
        fallbackLng: 'fr',
        supportedLngs: supportedLanguages,
        load: 'languageOnly',
        backend: {
            backends: [
                LocalStorageBackend,
                HttpApi
            ],
            backendOptions: [
                {
                    prefix: 'i18next_res_',
                    expirationTime: 14 * 24 * 60 * 60 * 1000,
                },
                {
                    customHeaders: {
                        "Content-Type" : 'application/json',
                        "Accept": 'application/json',
                    },
                    loadPath: `${baseUrl}/translations?language={{lng}}`,
                    parse: (data) => {
                        const parsedData = JSON.parse(data);
                        const translations = {};

                        parsedData.forEach((resource) => {
                            const key = resource.key;
                            const value = resource.value;

                            translations[key] = value;
                        });
                        return translations;
                    },
                },
            ],
            cacheHitMode: 'refresh',
        },
        react: {
            useSuspense: true,
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;