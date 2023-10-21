import Button from "@codegouvfr/react-dsfr/Button.js";
import LinkButton from "../components/LinkButton/LinkButton.jsx";
import Input from "@codegouvfr/react-dsfr/Input.js";
import ScriptedPasswordInput, {Severity} from "../components/ScriptedPasswordInput.jsx";
import {useState} from "react";
import {fr} from "@codegouvfr/react-dsfr";

const Login = ({
    onLoginSuccessful = void 0,
}) => {
    let email = '';
    let password = '';

    const [passwordErrorSeverity, setPasswordErrorSeverity] = useState(Severity.INFO);

    const handleLogin = async (e) => {
        e.preventDefault();
        setPasswordErrorSeverity(Severity.ERROR);

        // TODO add loader
        console.log('Email:', email, 'Password:', password);

        setTimeout(() => onLoginSuccessful('2342f2f1d131rf12'), 250);
    };

    return (
        <form onSubmit={handleLogin} className={'fr-col-md-6 fr-col-lg-4 centered'}>
            <h1 className={fr.cx('cente')}>Se connecter</h1>
            <Input
                label="Adresse mail"
                nativeInputProps={{
                    type: 'email',
                }}
                onChange={(e) => email = e.target.value}
            ></Input>
            <ScriptedPasswordInput
                invalidType={passwordErrorSeverity}
                onChange={(e) => password = e.target.value}
            />

            <div className={'flex flex-column justify-center align-center gap-2 fr-my-4w'}>
                <Button>Se connecter</Button>
                <LinkButton
                    to={'/'}
                    suffixIcon='fr-icon-arrow-right-line fr-icon--sm'
                >
                    Créer un compte
                </LinkButton>
            </div>
        </form>
    );
};

export default Login;