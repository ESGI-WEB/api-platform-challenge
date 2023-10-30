import LocalStorageBackend from 'i18next-localstorage-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import Backend from 'i18next-chained-backend';

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: true,
        backend: {
            backends: [
                LocalStorageBackend,
                HttpApi
            ],
            backendOptions: [
                {
                    prefix: 'i18next_res_',
                    expirationTime: 7 * 24 * 60 * 60 * 1000,
                },
                {
                    loadPath: 'http://localhost:8888/api/translations?language={{lng}}',
                    parse: (data) => {
                        const parsedData = JSON.parse(data)["hydra:member"];
                        const translations = {};

                        parsedData.forEach((resource) => {
                            const key = resource.key;
                            const value = resource.value;

                            translations[key] = value;

                        });

                        return translations;
                    }
                }
            ],
            cacheHitMode: 'refresh',
        },
        interpolation: {
            escapeValue: false
        },
    });

export default i18n;
