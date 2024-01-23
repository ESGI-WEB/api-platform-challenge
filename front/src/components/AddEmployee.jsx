import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@codegouvfr/react-dsfr/Button";
import Divider from "@mui/material/Divider";

export default function AddEmployee({ organisation, employeeToAdd }) {
    const { t } = useTranslation();
    const [employeeEmail, setEmployeeEmail] = useState("");

    const handleAddEmployee = () => {
        if (!employeeEmail) {
            return;
        }
        employeeToAdd(employeeEmail);
        setEmployeeEmail("");
    }

    return (
        <div className="p-1">
            <Divider light />
            <Typography variant="subtitle1">
                {t("add_employee_by_email")}
            </Typography>
            <div className="flex gap-1 my-1">
                <TextField
                    label={t("email")}
                    size="small"
                    value={employeeEmail}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                />
                <Button color="primary" onClick={handleAddEmployee}>
                    {t("add")}
                </Button>
            </div>
        </div>
    );
}