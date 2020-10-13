import React from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Card, CardHeader, CardMedia, CardContent, IconButton, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Notifications, NotificationsOff } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        '&:hover': {
            cursor: "pointer"
        }
    },
    cardContent: {
        paddingTop: '0px'
    }
}));

function TruckCard(props) {
    const classes = useStyles();

    return (
        <Card className={props.className} onClick={props.onClick}>
            <CardHeader 
                title={<Link href={`/truck/${props.truck.id}`}>{props.truck.name}</Link>}
                subheader={props.truck.description}
                action={
                    <IconButton aria-label="settings">
                        <NotificationsOff/>
                    </IconButton>
                }
            />
            <CardContent className={classes.cardContent}>
                Currently at {props.truck.locationStr}
            </CardContent>
        </Card>
    );
}

export default TruckCard;