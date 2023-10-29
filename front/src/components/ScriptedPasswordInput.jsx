import PasswordInput from "@codegouvfr/react-dsfr/blocks/PasswordInput.js";
import {useEffect, useState} from "react";

export const PasswordSeverity = {
    INFO: "info",
    VALID: "valid",
    ERROR: "error",
}

export default function ScriptedPasswordInput({
    label = "Mot de passe",
    defaultPassword = "",
    passwordLength = 8,
    passwordLengthMessage = "8 caractères minimum",
    specialCharactersRegex = /[^\w\s]/,
    specialCharactersMessage = "1 caractère spécial minimum",
    digitRegex = /\d/,
    digitMessage = "1 chiffre minimum",
    validType = PasswordSeverity.VALID,
    invalidType = PasswordSeverity.INFO,
    onChange,
    onValidityChange,
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

    let isValid = false;

    const validatePassword = (password) => {
        return validations.map(({ message, validator }) => ({
            message,
            severity: validator(password) ? validType : invalidType,
        }));
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        const messages = validatePassword(newPassword);
        setMessages(messages);
        onChange(e);

        let newValidity = !messages.some(({ severity }) => severity === invalidType);
        if (newValidity !== isValid) {
            isValid = newValidity;
            onValidityChange(isValid);
        }
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
