import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Rating} from "@mui/material";
import Card from "@mui/material/Card";
import {useTranslation} from "react-i18next";
import TextField from "@mui/material/TextField";

export default function AnswerFeedbackCard({
    question = '',
    type = 'mark',
    isMandatory = false,
    onValueChanged = void 0,
    value = '',
}) {
    const {t} = useTranslation();
    return (
        <Card variant="outlined">
            <CardContent sx={{
                display: 'flex',
                gap: '8px',
                flexDirection: 'column'
            }}>
                <Typography>
                    {question}
                    {isMandatory && <span> *</span>}
                </Typography>
                {isMandatory && <span className="fr-hint-text">{t('mandatory_question')}</span>}
                {type === 'mark' &&
                    <div>
                        <Rating
                            onChange={(event, newValue) => onValueChanged(newValue)}
                            value={value}
                        />
                        <span className="fr-hint-text">{t('rate_by_star_hint')}</span>
                    </div>
                }
                {type === 'text' &&
                    <TextField
                        required={isMandatory}
                        multiline
                        rows={4}
                        value={value}
                        sx={{width: '100%'}}
                        onChange={(event) => onValueChanged(event.target.value)}
                        placeholder={t('write_your_feedback_here')}
                    />
                }
            </CardContent>
        </Card>
    );
}