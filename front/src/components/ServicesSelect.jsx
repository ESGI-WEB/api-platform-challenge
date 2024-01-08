"use client";

import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Badge from "@codegouvfr/react-dsfr/Badge.js";
import {useTranslation} from "react-i18next";

export default function ServicesSelect({
    data,
    loading,
    loadingPlaceholder = null,
    label = null,
    onChange = () => void 0,
    disabled = false,
    multiple = false,
}) {
    const [value, setValue] = useState([]);
    const [labelText, setLabelText] = useState();
    const [loadingText, setLoadingText] = useState();
    const {t, i18n} = useTranslation();

    useEffect(() => {
        setLabelText(label ?? t('choose_a_service'));
        setLoadingText(loadingPlaceholder ?? t('loading'));
    }, [i18n.language, label, loadingPlaceholder]);

    const handleOnChange = (e) => {
        setValue(e.target.value);
        onChange(e);
    }

    return (

        <FormControl fullWidth>
            <InputLabel>{labelText}</InputLabel>
            <Select
                className="force-input-hidden"
                disabled={disabled}
                value={value}
                multiple={multiple}
                label={labelText}
                onChange={handleOnChange}
                renderValue={(selected) =>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(Array.isArray(selected) ? selected : [selected]).map((value) => (<Badge as="span" noIcon key={value} severity="info">{value}</Badge>))}
                    </Box>
                }
            >
                {loading && <MenuItem disabled value="">{loadingText}</MenuItem>}
                {!loading && <MenuItem value="">{t('all_services')}</MenuItem>}
                {!loading && data.map((service) => (
                    <MenuItem value={service.title} key={service.title}>{service.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}