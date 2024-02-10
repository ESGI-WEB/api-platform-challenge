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

    setErrors(newErrors);
    console.log(errors)
    return isValid;
  };



  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);


    if(validateForm()){
      if (userType === 'provider'){
        const formData = new FormData();
        const sanitizedPhone = phone.replace(/\s/g, '').replace(/^0/, '');
        formData.append("lastname", name);
        formData.append("firstname", firstName);
        formData.append("email", email);
        formData.append("phone", sanitizedPhone !== null ? `+33${sanitizedPhone}` : null);
        formData.append("plainPassword", password);
        formData.append("file", file);



        userService.postProvider(formData).then((response) => {
          if (response) {
            setMessage(t('account_created'));
          }
        }).catch((error) => {
          console.error(error)
          setAlert({
            severity: AlertSeverity.ERROR,
          });
          window.scrollTo(0, 0)
        }).finally(() => setIsLoading(false));
      }

      else {
        const user = {}
        user.lastname = name
        user.firstname = firstName
        user.email = email
        user.phone = phone
        user.plainPassword = password
        if (userType === 'employee'){
          user.registerAsEmployee = true;
        }
        userService.postUser(user).then((response) => {
          if (response) {
            setMessage(t('account_created'));
          }
        }).catch((error) => {
          console.error(error)
          setAlert({
            severity: AlertSeverity.ERROR,
          });
          window.scrollTo(0, 0)
        }).finally(() => setIsLoading(false));
      }

    }

    else {
      setIsLoading(false)
    }

  };

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
      ></Input>
      {errors.email && <p>{errors.email}</p>}
      <Input
        label={t('last_name')}
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setName(e.target.value)}
      ></Input>
      {errors.name && <p>{errors.name}</p>}
      <Input
        label={t('first_name')}
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setFirstName(e.target.value)}
      ></Input>
      {errors.firstName && <p>{errors.firstName}</p>}
      <span className="fr-hint-text">{t('phone_optional')}</span>
      <Input
        label={t('phone_number')}
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setPhone(e.target.value)}
      ></Input>
      <ScriptedPasswordInput
        invalidType={passwordErrorSeverity}
        onChange={(e) => setPassword(e.target.value)}
        onValidityChange={setIsPasswordValid}
      />
      {errors.password && <p>{errors.password}</p>}
      <Input
        label={t('confirm_password')}
        nativeInputProps={{
          type: 'password',
        }}
        value={confirmPassword}
        onChange={(e) => handlePasswordChange(e.target.value)}
      ></Input>
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
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