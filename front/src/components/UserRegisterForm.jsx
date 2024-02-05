import Input from "@codegouvfr/react-dsfr/Input.js";
import ScriptedPasswordInput, {PasswordSeverity} from "../components/ScriptedPasswordInput.jsx";
import {useState} from "react";
import useAuthService from "../services/useAuthService.js";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import {useTranslation} from "react-i18next";
import useUserService from "../services/useUserService.js";
import {useNavigate} from "react-router-dom";

export default function UserRegisterForm ({ userType }) {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [email, setEmail] = useState('default');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState(null);
  const [alert, setAlert] = useState(null);
  const [passwordErrorSeverity, setPasswordErrorSeverity] = useState(PasswordSeverity.INFO);
  const AuthService = useAuthService();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const userService = useUserService();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);






  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);

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
          setMessage('Compte crée');
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
          setMessage('Compte crée');
        }
      }).catch((error) => {
        console.error(error)
        setAlert({
          severity: AlertSeverity.ERROR,
        });
        window.scrollTo(0, 0)
      }).finally(() => setIsLoading(false));
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
      <Input
        label={t('last_name')}
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setName(e.target.value)}
      ></Input>
      <Input
        label={t('first_name')}
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setFirstName(e.target.value)}
      ></Input>
      <span className="fr-hint-text">Facultatif. Pour être notifié lors des rdv</span>
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
      <Input
        label={t('confirm_password')}
        nativeInputProps={{
          type: 'password',
        }}
        value={confirmPassword}
        onChange={(e) => handlePasswordChange(e.target.value)}
      ></Input>

      {passwordMismatch && (
        <p>{t('password_not_identical')}</p>
      )}
      {userType === 'provider' && (
        <Input
          label='Télécharger un fichier PDF (optionnel)'
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