import PasswordInput from "@codegouvfr/react-dsfr/blocks/PasswordInput.js";
import {useEffect, useState} from "react";

export const Severity = {
    INFO: "info",
    VALID: "valid",
    ERROR: "error",
}

export default function ScriptedPasswordInput({
    label = "Mot de passe",
    defaultPassword = "",
    passwordLength = 12,
    passwordLengthMessage = "12 caractères minimum",
    specialCharactersRegex = /[^\w\s]/,
    specialCharactersMessage = "1 caractère spécial minimum",
    digitRegex = /\d/,
    digitMessage = "1 chiffre minimum",
    validType = Severity.VALID,
    invalidType = Severity.INFO,
    onChange,
}) {
    const [messages, setMessages] = useState([]);
    const [password, setPassword] = useState(defaultPassword);
    useEffect(() => {
        setMessages(validatePassword(password));
    }, [invalidType]);
    const validations = [
        {
            message: passwordLengthMessage,
            validator: (password) => password.length >= passwordLength,
        },
        {
            message: specialCharactersMessage,
            validator: (password) => specialCharactersRegex.test(password),
        },
        {
            message: digitMessage,
            validator: (password) => digitRegex.test(password),
        },
    ];

    const validatePassword = (password) => {
        return validations.map(({ message, validator }) => ({
            message,
            severity: validator(password) ? validType : invalidType,
        }));
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setMessages(validatePassword(newPassword));
        onChange(e);
    };

    useEffect(() => {
        setMessages(validatePassword(password));
    }, []);

    return (
        <PasswordInput
            label={label}
            value={password}
            onChange={handlePasswordChange}
            messages={messages}
        />
    );
}
