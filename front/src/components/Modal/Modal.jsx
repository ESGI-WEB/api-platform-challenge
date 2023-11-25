import Button from "@codegouvfr/react-dsfr/Button.js";
import './modal.css';

const Modal = ({
                   onClose = () => {
                   },
                   title = '',
                   children,
               }) => {
    return (
        <div className="modal-overlay"
             onClick={onClose}
        >
            <div className="modal"
                 onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3 className="margin-0">{title}</h3>
                    <Button
                        iconId="ri-close-line"
                        iconPosition="right"
                        onClick={onClose}
                        priority="tertiary no outline"
                    >
                        Fermer
                    </Button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
