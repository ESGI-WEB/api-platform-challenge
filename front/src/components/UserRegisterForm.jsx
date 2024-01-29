import Input from "@codegouvfr/react-dsfr/Input.js";
import ScriptedPasswordInput, {PasswordSeverity} from "../components/ScriptedPasswordInput.jsx";
import {useState} from "react";
import useAuthService from "../services/useAuthService.js";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import {useTranslation} from "react-i18next";
import useUserService from "../services/useUserService.js";
import {useNavigate} from "react-router-dom";

export default function UserRegisterForm () {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [email, setEmail] = useState('default');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [alert, setAlert] = useState(null);
  const [passwordErrorSeverity, setPasswordErrorSeverity] = useState(PasswordSeverity.INFO);
  const AuthService = useAuthService();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const userService = useUserService();
  const navigate = useNavigate();




  const handleRegister = () => {
    const user = {}
    user.lastname = name
    user.firstname = firstName
    user.email = email
    user.phone = phone
    user.plainPassword = password
    userService.postUser(user).then((response) => {
      if (response) {
        console.log(response)
      }
    }).catch((error) => {
      console.error(error)
      setAlert({
        severity: AlertSeverity.ERROR,
      });
      window.scrollTo(0, 0)
    }).finally(() => setIsLoading(false));
  };

  const handlePasswordChange = (value) => {
    setConfirmPassword(value);

    // Vérification en temps réel et mise à jour du statut de correspondance des mots de passe
    setPasswordMismatch(value !== password);
  };

  return (
    <form onSubmit={handleRegister} className={'fr-col-md-6 fr-col-lg-4 centered'}>
      <InPageAlert alert={alert} />
      <h1>Inscription</h1>
      <Input
        label={t('mail')}
        nativeInputProps={{
          type: 'email',
        }}
        onChange={(e) => setEmail(e.target.value)}
      ></Input>
      <Input
        label='Nom'
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setName(e.target.value)}
      ></Input>
      <Input
        label='Prénom'
        nativeInputProps={{
          type: 'text',
        }}
        onChange={(e) => setFirstName(e.target.value)}
      ></Input>
      <Input
        label='Numéro de téléphone'
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
        label='Confirmer le mot de passe'
        nativeInputProps={{
          type: 'password',
        }}
        value={confirmPassword}
        onChange={(e) => handlePasswordChange(e.target.value)}
      ></Input>

      {passwordMismatch && (
        <p>Les mots de passes ne sont pas identiques</p>
      )}
      <div className={'flex flex-column justify-center align-center gap-2 fr-my-4w'}>
        <LoadableButton
          isLoading={isLoading}
        >
          S'inscrire
        </LoadableButton>
      </div>
    </form>
  );
}