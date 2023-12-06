import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useTranslation} from "react-i18next";
export default function CardIndicator({
    title,
    description,
    to
}) {
    const { t } = useTranslation();

    return (
        <Card variant="outlined" sx={{ flexGrow: 1, flexBasis: 0, minHeight: 160 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions sx={{justifyContent: 'end'}}>
                <Button size="small">{t('see_more')}</Button>
            </CardActions>
        </Card>
    );
}