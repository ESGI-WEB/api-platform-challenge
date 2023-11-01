import PasswordInput from "@codegouvfr/react-dsfr/blocks/PasswordInput.js";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export const PasswordSeverity = {
    INFO: "info",
    VALID: "valid",
    ERROR: "error",
}

export default function ScriptedPasswordInput({
    defaultPassword = "",
    passwordLength = 8,
    specialCharactersRegex = /[^\w\s]/,
    digitRegex = /\d/,
    validType = PasswordSeverity.VALID,
    invalidType = PasswordSeverity.INFO,
    onChange,
    onValidityChange,
}) {
    const { t } = useTranslation();

    const passwordLabel = t("passwordLabel");
    const passwordLengthMessage = t("passwordLengthMessage");
    const specialCharactersMessage = t("specialCharactersMessage");
    const digitMessage = t("digitMessage");

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
            label={passwordLabel}
            value={password}
            onChange={handlePasswordChange}
            messages={messages}
        />
    );
}
