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
    truckTags: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(0.5),
        },
    },
    media: {
        height: 0,
        // paddingTop: '56.25%', // 16:9
        paddingTop: '30%',
        margin: "0 20px"
    }
}));

function TruckCard(props) {
    const classes = useStyles();

    return (
        <Card className={props.className}>
            <CardHeader 
                title={<Link href={`/trucks/${props.truck.id}`}>{props.truck.name}</Link>}
                subheader={props.truck.description}
                action={
                    <IconButton aria-label="settings">
                    {props.subscribed ? <NotificationsOff/> : <Notifications />}
                    </IconButton>
                }
            />
            <CardMedia
                className={classes.media}
                image={props.image}
                title={props.truck.name}
            />
            <CardContent>
                <div className={classes.truckTags}>
                    {props.tags.map((t, i) => (
                        <Chip key={i} label={t} href={`/search?tags=${t}`}></Chip>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default TruckCard;