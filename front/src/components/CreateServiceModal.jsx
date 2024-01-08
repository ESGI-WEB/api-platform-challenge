import {Button} from "@codegouvfr/react-dsfr/Button.js";
import Modal from "./Modal/Modal.jsx";
import LoadableButton from "./LoadableButton/LoadableButton.jsx";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import InPageAlert, {AlertSeverity} from "./InPageAlert.jsx";
import Input from "@codegouvfr/react-dsfr/Input.js";
import useServiceService from "../services/useServiceService.js";
import useOrganisationService from "../services/useOrganisationService.js";


export default function CreateServiceModal({
  organisationId,
  onServiceCreated = void 0
                                           }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const {t} = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const serviceService = useServiceService();
  const organisationService = useOrganisationService();
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateService = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    serviceService.post({title, description, organisation:organisationService.getURI(organisationId)} ).then((response) => {
      if (response) {
        onServiceCreated(response)
        setMessage(t('service_created'));
      }
    }).catch((error) => {
      console.error(error);
      setAlert({
        description: t('error_occurred'),
        severity: AlertSeverity.ERROR,
      });
      window.scrollTo(0, 0);
    }).finally(() => setIsLoading(false));
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>{t('service_creation')}</Button>
      {isModalOpen &&
        <Modal
          title={t('create_service')}
          onClose={() => setIsModalOpen(false)}
        >
          <InPageAlert alert={alert}/>
          <form onSubmit={handleCreateService} className={'flex flex-column'}>
            <Input
              label={t('title')}
              nativeInputProps={{
                type: 'text',
              }}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <Input
              label={t('description')}
              textArea
              nativeTextAreaProps={{
                rows: 8,
              }}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
            <LoadableButton type="submit" isLoading={isLoading}>{t('create_service')}</LoadableButton>
            <div className="message">{message ? <p>{message}</p> : null}</div>
          </form>
        </Modal>
      }
    </>
  );
}