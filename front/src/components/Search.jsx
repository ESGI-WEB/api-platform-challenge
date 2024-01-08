"use client";

import {useTranslation} from "react-i18next";
import TextField from "@mui/material/TextField";
import {IconButton} from "@mui/material";
import {useEffect, useState} from "react";

export default function Search({
    onSearch = () => void 0,
    onChange = () => void 0,
    placeholder = null,
    disabled = false,
}) {
    const {t, i18n} = useTranslation();
    const [placeholderText, setPlaceholderText] = useState();

    useEffect(() => {
        setPlaceholderText(placeholder ?? t('search_a_police_station'));
    }, [placeholder, i18n.language]);

    return (
        <form className="flex" onSubmit={onSearch}>
            <TextField
                id="search"
                label={placeholderText}
                variant="outlined"
                fullWidth
                onChange={onChange}
                disabled={disabled}
            />
            <IconButton
                type="submit"
                disabled={disabled}
                aria-label={placeholder}
            >
                <i className="fr-icon-search-line"/>
            </IconButton>
        </form>
    );
}