import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import requests from '../util/requests';
import { connect } from 'react-redux';
import clsx from 'clsx';

import { Card, CardHeader, CardMedia, CardContent, IconButton, Chip } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Notifications, NotificationsOff } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';

const useStyles = makeStyles(theme => ({
    root: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
    truckTags: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
        paddingTop: '16px',
    },
    media: {
        height: 0,
        // paddingTop: '56.25%', // 16:9
        paddingTop: '30%',
        margin: '0 20px',
    },
    currentLocation: {
        fontSize: '16px',
    },
    noMedia: {
        paddingTop: '0px',
    },
    rating: {
        textAlign: 'left',
        marginTop: '-10px',
        marginLeft: '15px',
    },
}));

function TruckCard(props) {
    const classes = useStyles();
    const router = useRouter();

    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (props.userId)
            requests
                .get(`${process.env.FOOD_TRUCK_API_URL}/users/${props.userId}/subscriptions/${props.truck.id}`)
                .then(() => {
                    setSubscribed(true);
                })
                .catch(() => {});
    }, []);

    const toggleSubscribe = () => {
        if (!props.auth.isLoggedIn) {
            alert(
                'To subscribe to a food truck, you need to be logged in. Click the log-in button in the top right to log in or create an account.'
            );
        } else {
            if (!subscribed) {
                requests
                    .postWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${props.userId}/subscriptions/${props.truck.id}`,
                        {},
                        props.auth
                    )
                    .then(() => {
                        setSubscribed(true);
                    })
                    .catch(err => console.log(err));
            } else {
                requests
                    .deleteWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${props.userId}/subscriptions/${props.truck.id}`,
                        props.auth
                    )
                    .then(() => {
                        setSubscribed(false);
                    })
                    .catch(err => console.log(err));
            }
        }
    };

    const noMediaClass = clsx({
        [classes.noMedia]: !props.image,
    });

    return (
        <Card className={props.className}>
            <CardHeader
                title={
                    <Link href={`/trucks/${props.truck.id}`}>
                        <a>{props.truck.name}</a>
                    </Link>
                }
                // eslint-disable-next-line react/no-children-prop
                subheader={<ReactMarkdown children={props.truck.description} renderers={{ paragraph: 'span' }} />}
                action={
                    props.userId ? (
                        <IconButton aria-label="settings" onClick={toggleSubscribe}>
                            {subscribed ? <NotificationsOff /> : <Notifications />}
                        </IconButton>
                    ) : undefined
                }
            />
            <div className={classes.rating}>
                <Rating name="rating" precision={0.5} value={props.truck.rating} size="medium" readOnly />
            </div>
            {props.image && <CardMedia className={classes.media} image={props.image} title={props.truck.name} />}
            <CardContent className={noMediaClass}>
                {props.truck.currentLocation && (
                    <div className={classes.currentLocation}>
                        Currently at <strong>{props.truck.currentLocation?.location}</strong>{' '}
                        {props.truck.currentDistance !== undefined && props.truck.currentDistance !== null
                            ? `(${props.truck.currentDistance.toFixed(2)} mi)`
                            : ''}
                    </div>
                )}
                {props.tags.length > 0 && (
                    <div className={classes.truckTags}>
                        {props.tags.map((t, i) => (
                            <Chip
                                key={i}
                                label={t}
                                onClick={() =>
                                    router.push({
                                        pathname: '/search',
                                        query: { tag: t },
                                    })
                                }
                            ></Chip>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

TruckCard.propTypes = {
    userId: PropTypes.any,
    tags: PropTypes.array,
    truck: PropTypes.object.isRequired,
    image: PropTypes.string,
    className: PropTypes.string,
    auth: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TruckCard);
