import React, { useState } from 'react';
import UserRegisterForm from "../components/UserRegisterForm.jsx";
import {useTranslation} from "react-i18next";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";



export default function Register() {
  const [ value, setValue ] = useState('employee')
  const {t} = useTranslation();


  return (
    <div>
        <RadioButtons
          options={[
            {
              label: t('you_are_commissioner'),
              nativeInputProps: {
                checked: value === "provider",
                onChange: ()=> setValue("provider")
              }
            },
            {
              label: t('you_are_police_officer'),
              nativeInputProps: {
                checked: value === "employee",
                onChange: ()=> setValue("employee")
              }
            }
          ]}
        />

      <div>
        {value === 'provider' && <UserRegisterForm userType='provider' />}
        {value === 'employee' && <UserRegisterForm userType='employee' />}
      </div>
    </div>
  );
}
