import LinkButton from "../components/LinkButton/LinkButton.jsx";
import Input from "@codegouvfr/react-dsfr/Input.js";
import ScriptedPasswordInput, {PasswordSeverity} from "../components/ScriptedPasswordInput.jsx";
import {useState} from "react";
import useAuthService from "../services/useAuthService.js";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import {useTranslation} from "react-i18next";

export default function Login ({
    onLoginSuccessful = void 0,
}) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [email, setEmail] = useState('default');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(null);
    const [passwordErrorSeverity, setPasswordErrorSeverity] = useState(PasswordSeverity.INFO);
    const AuthService = useAuthService();

    const handleLogin = (e) => {
        e.preventDefault();
        setPasswordErrorSeverity(PasswordSeverity.ERROR);

        if (!isPasswordValid || !email) {
            setAlert({
                description: t('errorOnLogin'),
                severity: AlertSeverity.ERROR,
            });
            window.scrollTo(0, 0)
            return;
        }

        setAlert(null);
        setIsLoading(true);

        AuthService.login(email, password).then((response) => {
            setPasswordErrorSeverity(PasswordSeverity.INFO);
            onLoginSuccessful(response.token);
        }).catch((error) => {
            console.error(error)
            setAlert({
                description: t('errorOnIdentifiers'),
                severity: AlertSeverity.ERROR,
            });
            window.scrollTo(0, 0)
        }).finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleLogin} className={'fr-col-md-6 fr-col-lg-4 centered'}>
            <InPageAlert alert={alert} />
            <h1>{t('login')}</h1>
            <Input
                label={t('mail')}
                nativeInputProps={{
                    type: 'email',
                }}
                onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <ScriptedPasswordInput
                invalidType={passwordErrorSeverity}
                onChange={(e) => setPassword(e.target.value)}
                onValidityChange={setIsPasswordValid}
            />

            <div className={'flex flex-column justify-center align-center gap-2 fr-my-4w'}>
                <LoadableButton
                    isLoading={isLoading}
                >
                    {t('login')}
                </LoadableButton>
                <LinkButton
                    to={'/register'}
                    suffixIcon='fr-icon-arrow-right-line fr-icon--sm'
                >
                    {t('createAccount')}
                </LinkButton>
            </div>
        </form>
    );
};