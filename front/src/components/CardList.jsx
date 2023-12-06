import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
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
                            <ListItemAvatar>
                                <Avatar>{item.name[0]}{item.firstName[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.name + " " +item.firstName}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.date}
                                        </Typography>
                                        {" — " + item.commissariat}
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