import React, { useState } from 'react';
import UserRegisterForm from "../components/UserRegisterForm.jsx";
import {useTranslation} from "react-i18next";


export default function Register() {
  const {t} = useTranslation();


  return (
      <div className="fr-col-md-6 fr-col-lg-4 centered">
        <UserRegisterForm userType='user'/>
        <a className="fr-link fr-icon-arrow-right-line fr-link--icon-right" href="/register-organisation">{t('are_you_police')}</a>
      </div>

  );
}
