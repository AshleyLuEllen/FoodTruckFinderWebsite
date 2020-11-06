import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { connect } from 'react-redux';

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

    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${props.userId}/subscriptions/${props.truck.id}`)
        .then(res => {
            setSubscribed(true);
        })
        .catch(err => {});
    }, []);

    const toggleSubscribe = () => {
        if (!props.auth.isLoggedIn) {
            alert("To subscribe to a food truck, you need to be logged in. Click the log-in button in the top right to log in or create an account.");
        } else {
            if (!subscribed) {
                axios.post(`${process.env.FOOD_TRUCK_API_URL}/users/${props.userId}/subscriptions/${props.truck.id}`, {}, {
                    auth: {
                        username: props.auth.email,
                        password: props.auth.password
                    }
                })
                .then(res => {
                    setSubscribed(true);
                })
                .catch(err => console.log(err));
            } else {
                axios.delete(`${process.env.FOOD_TRUCK_API_URL}/users/${props.userId}/subscriptions/${props.truck.id}`, {
                    auth: {
                        username: props.auth.email,
                        password: props.auth.password
                    }
                })
                .then(res => {
                    setSubscribed(false);
                })
                .catch(err => console.log(err));
            }
        }
    }

    return (
        <Card className={props.className}>
            <CardHeader
                title={<Link href={`/trucks/${props.truck.id}`}>{props.truck.name}</Link>}
                subheader={props.truck.description}
                action={
                    <IconButton aria-label="settings" onClick={toggleSubscribe}>
                    {subscribed ? <NotificationsOff/> : <Notifications />}
                    </IconButton>
                }
            />
            {props.image && <CardMedia
                className={classes.media}
                image={props.image}
                title={props.truck.name}
            />}
            <CardContent>
                <div className={classes.truckTags}>
                    {props.tags.map((t, i) => (
                        <Chip key={i} label={t} href={`/search?tags=${t}`}></Chip>
                    ))}
                </div>
                {props.truck.currentLocation && <div>
                    Currently at {props.truck.currentLocation?.truck_location}
                </div>}
            </CardContent>
        </Card>
    );
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(TruckCard);