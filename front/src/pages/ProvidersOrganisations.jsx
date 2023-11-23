import { useEffect, useState } from "react";
import useOrganisationService from "../services/useOrganisationService.js";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Button } from "@codegouvfr/react-dsfr/Button";
import {useNavigate} from "react-router-dom";



export default function ProvidersOrganisations() {

  const OrganisationService = useOrganisationService();
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await OrganisationService.organisations();
        setOrganisations(result);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      } finally {
        // Mettez à jour l'état de chargement une fois que les données sont récupérées, que ce soit avec succès ou en cas d'erreur.
        setLoading(false);
      }
    };

    fetchData();
  }, [OrganisationService]);

  const navigateToCreateOrganisation = () => {
    // 👇️ navigate to /contacts
    navigate('/create-organisation');
  };




  return (
    <div>
      <div className={"mb-20"}>
        <Button onClick={navigateToCreateOrganisation}>
          Créer une organisation
        </Button>
      </div>
      <h1>Vos organisations</h1>
      {loading && <p>Loading...</p>} {/* Affichez l'indicateur de chargement si loading est true */}

      <div>
        <div
          className={"flex gap-2 flex-wrap"}
        >
          {organisations.map(function(organisation, idx){
            return (
              <div
                key={idx}
                className="container"
                style={{
                  width: 320
                }}
              >
                <Card
                  background
                  border
                  footer={<button className="fr-btn">Créer des services</button>}
                  linkProps={{
                    href: '#'
                  }}
                  size="medium"
                  title={organisation.name}
                  titleAs="h3"
                />

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

