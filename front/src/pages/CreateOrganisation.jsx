import useOrganisationService from "../services/useOrganisationService.js";
import { useState } from "react";
import InPageAlert, {AlertSeverity} from "../components/InPageAlert.jsx";
import LoadableButton from "../components/LoadableButton/LoadableButton.jsx";
import Input from "@codegouvfr/react-dsfr/Input.js";


export default function CreateOrganisation() {
  // TODO TO REWORD (translations, form with addresses)
  const [name, setName] = useState("test initial");
  const [latitude, setLatitude] = useState("12.3456789");
  const [longitude, setLongitude] = useState("12.3456789");
  const [message, setMessage] = useState("");


  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const OrganisationService = useOrganisationService();


  const handleCreateOrganisation = async (e) => {
    e.preventDefault();
    setMessage("")
    setIsLoading(true);

    OrganisationService.organisation(name, latitude, longitude).then((response) => {
      if(response){
        setMessage("Organisation created")
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
      <form onSubmit={handleCreateOrganisation} className={'flex flex-center flex-column'}>
        <Input
          label="Name"
          nativeInputProps={{
            type: 'text',
          }}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Latitude"
          nativeInputProps={{
            type: 'text',
          }}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <Input
          label="Longitude"
          nativeInputProps={{
            type: 'text',
          }}
          onChange={(e) => setLongitude(e.target.value)}
        />

        <LoadableButton type="submit" isLoading={isLoading}>Create</LoadableButton>
        <div className="message">{message ? <p>{message}</p> : null}</div>

      </form>
    </div>
  )
}