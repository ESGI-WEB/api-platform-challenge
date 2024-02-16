import Input from "@codegouvfr/react-dsfr/Input.js";
import ScriptedPasswordInput, {PasswordSeverity} from "../components/ScriptedPasswordInput.jsx";
import {useState} from "react";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import {useTranslation} from "react-i18next";
import useUserService from "../services/useUserService.js";

export default function UserRegisterForm ({ userType }) {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState(null);
  const [alert, setAlert] = useState(null);
  const [passwordErrorSeverity, setPasswordErrorSeverity] = useState(PasswordSeverity.INFO);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const userService = useUserService();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    firstName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!email) {
      newErrors.email = t('email_required');
      isValid = false;
    }

    if (!name) {
      newErrors.name = t('name_required');
      isValid = false;
    }

    if (!firstName) {
      newErrors.firstName = t('firstname_required');
      isValid = false;
    }

    if (!password) {
      newErrors.password = t('password_required');
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('confirm_password_required');
      isValid = false;
    }

    if (phone && !sanitizePhone(phone).match(/^\+33[0-9]{9}$/)) {
      newErrors.phone = t('phone_invalid');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const sanitizePhone = (phone) => {
    return phone.replace(/\s/g, '').replace(/^0/, '+33');
  }

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);
    setMessage("");

    if(validateForm()){
      let sanitizedPhone = null;
      if (phone?.length) {
        sanitizedPhone = sanitizePhone(phone);
      }

      if (userType === 'provider') {
        const formData = new FormData();

        if (sanitizedPhone) {
          formData.append("phone", sanitizedPhone);
        }

        formData.append("lastname", name);
        formData.append("firstname", firstName);
        formData.append("email", email);
        formData.append("plainPassword", password);
        formData.append("file", file);

        userService.postProvider(formData).then((response) => {
          if (response) {
            setMessage(t('account_created'));
          }
        }).catch(handleFormError).finally(() => setIsLoading(false));
      } else {
        const user = {}
        user.lastname = name
        user.firstname = firstName
        user.email = email
        user.plainPassword = password
        if (userType === 'employee'){
          user.registerAsEmployee = true;
        }
        if (sanitizedPhone) {
          user.phone = sanitizedPhone;
        }
        userService.postUser(user).then((response) => {
          if (response) {
            setMessage(t('account_created'));
          }
        }).catch(handleFormError).finally(() => setIsLoading(false));
      }

    } else {
      setIsLoading(false)
    }

  };

  const handleFormError = (error) => {
    console.error(error)
    if (error?.message) {
      const errorMessages = error.message.split('\n');
      const errorsToDisplay = {};
      for (const errorMessage of errorMessages) {
        const [field, message] = errorMessage.split(':');
        errorsToDisplay[field] = message;
      }
      setErrors(errorsToDisplay);
    }

    setAlert({
      severity: AlertSeverity.ERROR,
    });

    window.scrollTo(0, 0)
  }

  const handlePasswordChange = (value) => {
    setConfirmPassword(value);
    setPasswordMismatch(value !== password);
  };

  return (
    <form onSubmit={handleRegister}>
      <InPageAlert alert={alert} />
      <h1>{t('registration')}</h1>
      <Input
        label={t('mail')}
        nativeInputProps={{
          type: 'email',
        }}
        onChange={(e) => setEmail(e.target.value)}
        state={errors.email ? "error" : "default"}
        stateRelatedMessage={errors.email}
      ></Input>
      <Input
        label={t('last_name')}
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setName(e.target.value)}
        state={errors.name ? "error" : "default"}
        stateRelatedMessage={errors.name}
      ></Input>
      <Input
        label={t('first_name')}
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setFirstName(e.target.value)}
        state={errors.firstName ? "error" : "default"}
        stateRelatedMessage={errors.firstName}
      ></Input>
      <span className="fr-hint-text">{t('phone_optional')}</span>
      <Input
        label={t('phone_number')}
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setPhone(e.target.value)}
        state={errors.phone ? "error" : "default"}
        stateRelatedMessage={errors.phone}
      ></Input>
      <ScriptedPasswordInput
        invalidType={passwordErrorSeverity}
        onChange={(e) => setPassword(e.target.value)}
        onValidityChange={setIsPasswordValid}
      />
      <Input
        label={t('confirm_password')}
        nativeInputProps={{
          type: 'password',
        }}
        value={confirmPassword}
        onChange={(e) => handlePasswordChange(e.target.value)}
        state={errors.confirmPassword ? "error" : "default"}
        stateRelatedMessage={errors.confirmPassword}
      ></Input>
      {passwordMismatch && (
        <p>{t('password_not_identical')}</p>
      )}
      {userType === 'provider' && (
        <Input
          label={t('upload_pdf')}
          nativeInputProps={{
            type: 'file',
            accept: '.pdf',
          }}
          onChange={(e) => setFile(e.target.files[0])}
        ></Input>
      )}
      <div className={'flex flex-column justify-center align-center gap-2 fr-my-4w'}>
        <LoadableButton
          isLoading={isLoading}
        >
          {t('registration')}
        </LoadableButton>
        { message &&
          <div className="message">{message ? <p>{message}</p> : null}</div>
        }
      </div>

    </form>
  );
}