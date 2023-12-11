import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {useTranslation} from "react-i18next";
import { Button } from "@codegouvfr/react-dsfr/Button";

export default function CardList({
    title,
    description,
    list = [],
    to
}) {

    const { t } = useTranslation();

    return (
        <Card variant="outlined" sx={{ flexGrow: 1, flexBasis: 0 }}>
            <CardContent sx={{ minHeight: 160 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <List variant="outlined">
                {list.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={item.title}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline', fontWeight: 'bold', marginBottom: '5px' }}
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {
                                                new Date(item.subtitle).toLocaleDateString(undefined, {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                            }
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'block', marginTop: '5px' }}
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {item.description}
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'block', color: '#555' }}
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {item.subdescription}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        {index < list.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
            <CardActions sx={{ justifyContent: 'center' }}>
                <Button
                    size="small"
                    linkProps={{
                        href: {to}
                    }}
                    priority="tertiary no outline"
                >
                    {t("see_more")}
                </Button>
            </CardActions>
        </Card>
    );
}