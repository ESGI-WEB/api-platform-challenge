import { Card } from "@codegouvfr/react-dsfr/Card";
import { Tag } from "@codegouvfr/react-dsfr/Tag";

export default function LandingPagePresta() {

  const prestationData = [
    {
      name: "presta #1",
      labelDispo: "1 jour",
      description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
    },
    {
      name: "presta #2",
      labelDispo: "3 jour",
      description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
    },
    {
      name: "presta #3",
      labelDispo: "1 mois",
      description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
    },
    {
      name: "presta #4",
      labelDispo: "2 semaines",
      description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
    },
    {
      name: "presta #6",
      labelDispo: "1 heure",
      description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
    },
    {
      name: "presta #7",
      labelDispo: "1 heure",
      description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
    },
    {
      name: "presta #8",
      labelDispo: "1 heure",
      description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
    },
  ];

  const currentPrestationData = [
    {
      name: "votre presta #1",
      labelDate: "08/11 14h",
      description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
    }
  ]


  return (
    <div>
      <h1>Nom commissariat</h1>
      <div>
        {currentPrestationData.length > 0 &&
          <div>
            <h2>Vos rendez-vous</h2>
            <div
              className={"flex gap-2 flex-wrap"}
            >
              {currentPrestationData.map(function(presta, idx){
                return (
                  <div
                    key={idx}
                    className="container"
                    style={{
                      width: 320,
                      paddingBottom: 25
                    }}
                  >
                    <Card
                      background
                      border
                      desc={presta.description}
                      enlargeLink
                      linkProps={{
                        href: '#'
                      }}
                      size="medium"
                      start={<ul className="fr-tags-group"><li><Tag>Date : {presta.labelDate}</Tag></li></ul>}
                      title={presta.name}
                      titleAs="h3"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>
      <div>
        <h2>Nos prestations</h2>
          <div
            className={"flex gap-2 flex-wrap"}
          >
            {prestationData.map(function(presta, idx){
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
                  desc={presta.description}
                  enlargeLink
                  linkProps={{
                    href: '#'
                  }}
                  size="medium"
                  start={<ul className="fr-tags-group"><li><Tag>Disponible sous : {presta.labelDispo}</Tag></li></ul>}
                  title={presta.name}
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

