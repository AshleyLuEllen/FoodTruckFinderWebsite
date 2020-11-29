import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/dist/next-server/lib/head';

import { Container, Typography, CircularProgress, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FriendAvatar from '../../../components/FriendAvatar';

const useFriendCardStyles = makeStyles(theme => ({
    root: {
        background: 'red',
    },
    avatar: {
        width: theme.spacing(16),
        height: theme.spacing(16),
        fontSize: theme.spacing(10),
        margin: '0 auto',
    },
}));

function FriendCard(props) {
    const classes = useFriendCardStyles();

    return (
        <div className={classes.root}>
            <FriendAvatar className={classes.avatar} user={props.user} />
            {props.user.firstName} {props.user.lastName}
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: '20px',
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '87vh',
    },
    progress: {
        margin: '0 auto',
    },
    avatar: {
        width: theme.spacing(16),
        height: theme.spacing(16),
        fontSize: theme.spacing(10),
        margin: '0 auto',
    },
}));

function FriendsPage() {
    const router = useRouter();
    const classes = useStyles();

    const [friends, setFriends] = useState([]);
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (router.query?.user_id) {
            axios
                .get(`${process.env.FOOD_TRUCK_API_URL}/users/${router.query.user_id}`)
                .then(res => {
                    setUser(res.data);

                    return axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${router.query.user_id}/friends`);
                })
                .then(res => {
                    setFriends(res.data);
                    setLoading(false);
                })
                .catch(error => {
                    router.push('/');
                });
        }
    }, [router.query?.user_id]);

    return loading ? (
        <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} size="3.5rem" />
        </div>
    ) : (
        <Container className={classes.root}>
            <Typography variant="h4" style={{ marginBottom: '10px', textAlign: 'center' }}>
                {user?.firstName}'s Friends
            </Typography>
            <ul>
                {friends.map((user, i) => (
                    <FriendCard key={i} user={user} a={2} b={3} />
                ))}
            </ul>
        </Container>
    );
}

export default FriendsPage;
