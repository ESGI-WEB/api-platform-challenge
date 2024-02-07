import Button from "@codegouvfr/react-dsfr/Button.js";
import './modal.css';
import {useTranslation} from "react-i18next";

const Modal = ({
                   onClose = void 0,
                   title = '',
                   children,
               }) => {
    const {t} = useTranslation();
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
                        {t('close')}
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
