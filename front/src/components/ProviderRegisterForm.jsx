import Input from "@codegouvfr/react-dsfr/Input.js";
import ScriptedPasswordInput, {PasswordSeverity} from "../components/ScriptedPasswordInput.jsx";
import {useState} from "react";
import useAuthService from "../services/useAuthService.js";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import {useTranslation} from "react-i18next";
import useUserService from "../services/useUserService.js";
import {useNavigate} from "react-router-dom";

export default function ProviderRegisterForm () {
  const { t } = useTranslation();
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
      <span className="fr-hint-text">Facultatif. Pour être notifié lors des rdv</span>
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
      <Input
        label='Télécharger un fichier PDF (optionnel)'
        nativeInputProps={{
          type: 'file',
          accept: '.pdf',
        }}
        onChange={(e) => setFile(e.target.files[0])}
      ></Input>
      <div className={'flex flex-column justify-center align-center gap-2 fr-my-4w'}>
        <LoadableButton
          isLoading={isLoading}
        >
          S'inscrire
        </LoadableButton>
        { message &&
          <div className="message">{message ? <p>{message}</p> : null}</div>
        }
        <a className="fr-link fr-icon-arrow-right-line fr-link--icon-right" href="/register-organisation">Vous êtes policier ou commissaire ?</a>
      </div>

    </form>
  );
}