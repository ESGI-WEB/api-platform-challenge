import { fr } from "@codegouvfr/react-dsfr";
import React, {useState} from 'react';
import PasswordInput from "@codegouvfr/react-dsfr/blocks/PasswordInput.js";
import Button from "@codegouvfr/react-dsfr/Button.js";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Mettez ici le code pour gérer la connexion
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <>
            <PasswordInput
                label="Mot de passe"
                messages={[
                    {
                        message: '12 caractères minimum',
                        severity: 'info'
                    },
                    {
                        message: '1 caractère spécial minimum',
                        severity: 'valid'
                    },
                    {
                        message: '1 chiffre minimum',
                        severity: 'error'
                    }
                ]}
            />
            <Button iconId="fr-icon-checkbox-circle-line">Label button MD</Button>
            <span className={fr.cx("fr-icon-ancient-gate-fill")} aria-hidden={true}/>
            <i className={fr.cx("fr-icon-ancient-gate-fill")} />
        </>
    );
};

export default Login;