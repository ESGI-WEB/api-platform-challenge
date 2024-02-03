import React, { useState } from 'react';
import ProviderRegisterForm from "../components/ProviderRegisterForm.jsx";
import EmployeeRegisterForm from "../components/EmployeeRegisterForm.jsx";

export default function Register() {
  const [selectedOption, setSelectedOption] = useState('user');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <h1>Register</h1>

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
              Vous êtes un policier
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
              Vous êtes un commisaire
            </label>
          </div>
        </div>
        <div className="fr-messages-group" id="radio-inline-messages" aria-live="assertive">
        </div>
      </fieldset>

      <div>
        {selectedOption === 'provider' && <ProviderRegisterForm />}
        {selectedOption === 'employee' && <EmployeeRegisterForm />}
      </div>
    </div>
  );
}
