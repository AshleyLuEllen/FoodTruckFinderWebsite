import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import requests from '../../../util/requests';
import Head from 'next/dist/next-server/lib/head';

import {Container, Typography, Paper, CircularProgress, Avatar, InputBase, TextField} from '@material-ui/core';
import {fade, makeStyles} from '@material-ui/core/styles';

import FriendAvatar from '../../../components/FriendAvatar';
import Grid from "@material-ui/core/Grid";
import {Search as SearchIcon} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import withRouter from "next/dist/client/with-router";
import PropTypes from "prop-types";

const useFriendCardStyles = makeStyles(theme => ({
    root: {
        background: 'white',
        width: '100%',
    },
    avatar: {
        width: theme.spacing(16),
        height: theme.spacing(16),
        fontSize: theme.spacing(10),
        margin: '0 auto',
        align: 'left',
        marginLeft: '0',
        marginRight: '0'
    },
    text: {
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
}));

function FriendCard(props) {
    const router = useRouter();
    const classes = useFriendCardStyles();

    const makeFriend = () => {
        requests.postWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/${props.userId}/friends/${props.user.id}`, props.auth)
            .then(console.log("New friend!"))
            .catch(err => console.log(err.message));
    };

    const removeFriend = () => {
        requests.deleteWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/${props.userId}/friends/${props.user.id}`, props.auth)
            .then(console.log("New friend!"))
            .catch(err => console.log(err.message));
    };

    return (
        <div className={classes.root}>
            <div style={{ display: 'flex', justifyContent: 'start'}}>
                <FriendAvatar className={classes.avatar} user={props.user} />
                <div className={classes.text}>
                    <Typography className={classes.text} variant={'h3'}>
                        {props.user.firstName} {props.user.lastName}
                    </Typography>
                    <Typography className={classes.text} variant={'subtitle1'}>
                        <strong>Bio:</strong> {props.user.description}
                    </Typography>
                    <Typography className={classes.text} variant={'subtitle1'}>
                        <strong>Email:</strong> {props.user.emailAddress}
                    </Typography>
                    {props.button &&
                        <div>
                            {requests.get(`${process.env.FOOD_TRUCK_API_URL}/users/${props.userID}/friends/${props.user.id}`) &&
                            <Button onClick={removeFriend}>
                                Unfriend
                            </Button> }
                            {!requests.get(`${process.env.FOOD_TRUCK_API_URL}/users/${props.userID}/friends/${props.user.id}`) &&
                            <Button color='secondary' onClick={makeFriend}>
                                Friend
                            </Button> }
                        </div>

                    }
                </div>
            </div>
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
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    searchButton: {
        width: 'auto',
        height: '100%',
        transition: '0.3s all',
        '&.hidden': {
            width: 0,
        },
    },
}));

function FriendsPage(props) {
    const router = useRouter();
    const classes = useStyles();

    const [friends, setFriends] = useState([]);
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [email, setEmail] = useState(undefined);
    const [first, setFirstName] = useState(undefined);
    const [last, setLastName] = useState(undefined);

    useEffect(() => {
        if (router.query?.user_id) {
            requests
                .get(`${process.env.FOOD_TRUCK_API_URL}/users/${router.query.user_id}`)
                .then(res => {
                    setUser(res.data);

                    return requests.get(`${process.env.FOOD_TRUCK_API_URL}/users/${router.query.user_id}/friends`);
                })
                .then(res => {
                    setFriends(res.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error.message);
                    router.push('/');
                });
        }
    }, [router.query?.user_id]);

    const searchForFriend = () => {
        console.log("Searching...");
        console.log(first);
        console.log(last);
        console.log(email);
        const friendQuery = {
            firstName: first,
            lastName: last,
            email: email,
        };


        requests.post(`${process.env.FOOD_TRUCK_API_URL}/users/search`, friendQuery)
            .then(res => {
                console.log("Searched!");
                setSearchResults(res.data);
                console.log(res.data);
            }).catch(err => console.log(err.message));
    }

    return loading ? (
        <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} size="3.5rem" />
        </div>
    ) : (
        <Container className={classes.root}>
            <Head>
                <title>Friends</title>
            </Head>
            <Typography variant="h4" style={{ marginBottom: '10px', textAlign: 'center' }}>
                {user?.firstName}'s Friends
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <ul>
                        {friends.map((user, i) => (
                            <div>
                            <FriendCard key={i} user={user} a={2} b={3} />
                            <br/>
                            </div>
                        ))}
                    </ul>
                </Grid>
                {router.query.user_id &&
                <Grid item xs={12} md={6}>
                    <Paper styles={{width: '100%'}}>
                        <div className={classes.search}>
                            <InputBase
                                variant={'outlined'}
                                placeholder="Search (email)…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                onChange={e => {setEmail(e.target.value);} }
                                inputProps={{ 'aria-label': 'search' }}
                            />
                            <br/>
                            <InputBase
                                variant={'outlined'}
                                placeholder="Search (first name)…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                onChange={e => {setFirstName(e.target.value);}}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                            <br/>
                            <InputBase
                                variant={'outlined'}
                                placeholder="Search (last name)…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                onChange={e => {setLastName(e.target.value);}}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                            <Button variant={'contained'} className={classes.searchButton} onClick={searchForFriend}>
                                Search
                            </Button>
                        </div>
                        <br/>
                        <br/>
                        {searchResults &&
                        <div>
                            {searchResults.map((user, i) =>
                                <FriendCard userID={router.query.user_id} button={true} key={i} user={user} a={2} b={3} />
                            )}
                        </div>}
                        {searchResults.length === 0 &&
                        <div>
                            <Typography variant={'subtitle1'}>
                                No results
                            </Typography>
                        </div>}
                    </Paper>
                </Grid>}
            </Grid>
        </Container>
    );
}

FriendsPage.propTypes = {
    auth: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}
const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FriendsPage));
