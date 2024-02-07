import React, { useState } from 'react';
import UserRegisterForm from "../components/UserRegisterForm.jsx";
import {useTranslation} from "react-i18next";


export default function Register() {
  const [selectedOption, setSelectedOption] = useState('user');
  const {t} = useTranslation();


  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <h1>{t('registration')}</h1>

      <fieldset className="fr-fieldset" id="radio-inline" aria-labelledby="radio-inline-legend radio-inline-messages">
        <div className="fr-fieldset__element fr-fieldset__element--inline">
          <div className="fr-radio-group">
            <input type="radio"
                   id="radio-inline-2"
                   name="radio-inline"
                   value="employee"
                   checked={selectedOption === 'employee'}
                   onChange={() => handleOptionChange('employee')}/>
            <label className="fr-label" htmlFor="radio-inline-2">
              {t('you_are_police_officer')}
            </label>
          </div>
        </div>
        <div className="fr-fieldset__element fr-fieldset__element--inline">
          <div className="fr-radio-group">
            <input type="radio"
                   id="radio-inline-3"
                   name="radio-inline"
                   value="provider"
                   checked={selectedOption === 'provider'}
                   onChange={() => handleOptionChange('provider')}/>
            <label className="fr-label" htmlFor="radio-inline-3">
              {t('you_are_commissioner')}
            </label>
          </div>
        </div>
        <div className="fr-messages-group" id="radio-inline-messages" aria-live="assertive">
        </div>
      </fieldset>

      <div>
        {selectedOption === 'provider' && <UserRegisterForm userType='provider' />}
        {selectedOption === 'employee' && <UserRegisterForm userType='employee' />}
      </div>
    </div>
  );
}
