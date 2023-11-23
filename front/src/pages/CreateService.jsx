import useOrganisationService from "../services/useOrganisationService.js";
import { useState } from "react";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import Input from "@codegouvfr/react-dsfr/Input.js";


export default function CreateOrganisation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");



  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const AuthService = useOrganisationService();


  function handleClick() {
    AuthService.organisations().then((response) => {
      console.log(response)
    })
  }

  const handleCreateOrganisation = async (e) => {
    e.preventDefault();
    setMessage("")
    setIsLoading(true);

    AuthService.organisation(title, description).then((response) => {
      if(response){
        setMessage("Service created")
        console.log(response)
      }
    }).catch((error) => {
      console.error(error)
      setAlert({
        description: "Une erreur s'est produite",
        severity: AlertSeverity.ERROR,
      });
      window.scrollTo(0, 0)
    }).finally(() => setIsLoading(false));
  }


  return (
    <div>
      <InPageAlert alert={alert} />
      <button onClick={handleClick}>Get Data</button>
      {/*<button onClick={handleCreateOrganisation("8f6079a2-7b15-11ee-b962-0242ac120002", "test from front", "12.3456789", "12.3456789", ["api/users/1"], [], "2023-11-04T13:09:17.614Z")}>Post Data</button>*/}
      <form onSubmit={handleCreateOrganisation} className={'flex flex-center flex-column'}>
        <Input
          label="Title"
          nativeInputProps={{
            type: 'text',
          }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Description"
          nativeInputProps={{
            type: 'text',
          }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <LoadableButton type="submit" isLoading={isLoading}>Create</LoadableButton>
        <div className="message">{message ? <p>{message}</p> : null}</div>

      </form>
    </div>
  )
}