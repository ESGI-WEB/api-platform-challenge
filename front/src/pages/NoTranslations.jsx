import Button from "@codegouvfr/react-dsfr/Button.js";

export default function NoTranslations() {
    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <div className="no-translations">
            <h1>Oops, une erreur s'est produite !</h1>
            <p className='margin-0'>Essayez de rafraichir la page ou de revenir plus tard.</p>
            <p>Si le problème persiste, veuillez nous contacter ou ne rejoindre au commissariat le plus proche de chez
                vous. <strong>En cas d'urgence appeler le 17</strong></p>
            <p className='margin-0'><strong>An error occurred !</strong> Try refreshing the page or come back later.</p>
            <p>If the issue persists, please contact us or visit the nearest police station. <strong>In case of emergency, call
                17 (police number) or 112 (European emergency number).</strong></p>
            <Button onClick={refreshPage}>Rafraîchir la page / Refresh page</Button>
        </div>
    );
};
