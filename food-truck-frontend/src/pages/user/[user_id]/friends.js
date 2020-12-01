import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import requests from '../../../util/requests';
import Head from 'next/dist/next-server/lib/head';

import { Container, Typography, Paper, CircularProgress, TextField, Snackbar } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import FriendAvatar from '../../../components/FriendAvatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import withRouter from 'next/dist/client/with-router';
import Divider from '@material-ui/core/Divider';

const useFriendCardStyles = makeStyles(theme => ({
    root: {
        background: 'white',
        width: '100%',
    },
    avatar: {
        width: theme.spacing(16),
        height: theme.spacing(16),
        fontSize: theme.spacing(8),
        margin: '10px',
        align: 'left',
    },
    text: {
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    buttonWrapper: {
        position: 'relative',
        marginTop: '10px',
    },
    buttonProgress: {
        //   color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function FriendCard(props) {
    const classes = useFriendCardStyles();

    const [areFriends, setAreFriends] = useState(false);
    const [loading, setLoading] = useState(false);

    if (props.button) {
        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/users/${props.auth.userId}/friends/${props.user.id}`)
            .then(res => setAreFriends(res.data))
            .catch(err => console.log(err.message));
    }

    const makeFriend = () => {
        setLoading(true);
        requests
            .postWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/users/${props.auth.userId}/friends/${props.user.id}`,
                props.auth,
                props.auth
            )
            .then(() => {
                props.makeFriend && props.makeFriend(true);
                setAreFriends(true);
                setLoading(false);
            })
            .catch(err => {
                props.makeFriend && props.makeFriend(false, err);
                setLoading(false);
            });
    };

    const removeFriend = () => {
        setLoading(true);
        requests
            .deleteWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/users/${props.auth.userId}/friends/${props.user.id}`,
                props.auth,
                props.auth
            )
            .then(() => {
                props.removeFriend && props.removeFriend(true);
                setLoading(false);
                setAreFriends(false);
            })
            .catch(err => {
                props.removeFriend && props.removeFriend(false, err);
                setLoading(false);
            });
    };

    console.log(props.user);

    return (
        <div className={classes.root}>
            <div style={{ display: 'flex', justifyContent: 'start', padding: '10px' }}>
                <FriendAvatar className={classes.avatar} user={props.user} />
                <div className={classes.text}>
                    <Typography className={classes.text} variant={'h4'}>
                        {props.user.firstName} {props.user.lastName}
                    </Typography>
                    {props.user.description && (
                        <Typography className={classes.text} variant={'subtitle1'}>
                            {props.user.description}
                        </Typography>
                    )}
                    {/* <Typography className={classes.text} variant={'subtitle1'}>
                        <strong>Email:</strong> {props.user.emailAddress}
                    </Typography> */}
                    {props.button && (
                        <span className={classes.buttonWrapper}>
                            {areFriends ? (
                                <Button
                                    color="secondary"
                                    variant={'contained'}
                                    onClick={removeFriend}
                                    disabled={loading}
                                >
                                    Unfriend
                                </Button>
                            ) : (
                                <Button color="primary" variant={'contained'} onClick={makeFriend} disabled={loading}>
                                    Friend
                                </Button>
                            )}
                            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

FriendCard.propTypes = {
    auth: PropTypes.any,
    user: PropTypes.any,
    button: PropTypes.any,
    makeFriend: PropTypes.func,
    removeFriend: PropTypes.func,
};

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
        padding: '10px',
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
        margin: '5px',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // // vertical padding + font size from searchIcon
        // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
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
    const [email, setEmail] = useState('');
    const [first, setFirstName] = useState('');
    const [last, setLastName] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorSeverity, setErrorSeverity] = useState('error');

    const fetchData = () => {
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
                .catch(() => {
                    router.push('/404');
                });
        }
    };

    useEffect(() => {
        fetchData();
    }, [router.query?.user_id]);

    const searchForFriend = () => {
        setFirstName(first.trim());
        setLastName(last.trim());
        setEmail(email.trim());

        const friendQuery = {
            firstName: first.trim(),
            lastName: last.trim(),
            email: email.trim(),
        };

        requests
            .post(`${process.env.FOOD_TRUCK_API_URL}/users/search`, friendQuery)
            .then(res => {
                setSearchResults(res.data.filter(f => f.id !== props.auth.userId));
                setHasSearched(true);
            })
            .catch(err => {
                console.error(err);
                setErrorMsg('Error: could not fetch search results. Please try again later.');
                setErrorOpen(true);
                setErrorSeverity('error');
            });
    };

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
                {user?.firstName}&apos;s Friends
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={props.auth.userId == router.query.user_id ? 6 : 12}>
                    {friends.map((user, i) => (
                        <div key={i}>
                            <FriendCard
                                auth={props.auth}
                                button={props.auth.userId !== user.id}
                                user={user}
                                makeFriend={(success, err) => {
                                    if (success) {
                                        setErrorMsg('Friend added');
                                        setErrorOpen(true);
                                        setErrorSeverity('success');
                                    } else {
                                        console.error(err);
                                        setErrorMsg('Error: friend could not be added. Try again later.');
                                        setErrorOpen(true);
                                        setErrorSeverity('error');
                                    }
                                }}
                                removeFriend={(success, err) => {
                                    if (success) {
                                        setErrorMsg('Friend removed');
                                        setErrorOpen(true);
                                        setErrorSeverity('success');
                                    } else {
                                        console.error(err);
                                        setErrorMsg('Error: friend could not be removed. Try again later.');
                                        setErrorOpen(true);
                                        setErrorSeverity('error');
                                    }
                                }}
                            />
                            <br />
                        </div>
                    ))}
                    {friends.length === 0 && (
                        <Paper elevation={2} style={{ textAlign: 'center', padding: '20px' }}>
                            <em>{user?.firstName} has no friends yet. You can be the first!</em>
                        </Paper>
                    )}
                </Grid>
                {props.auth.userId == router.query.user_id && (
                    <Grid item xs={12} md={6}>
                        <Paper styles={{ width: '100%' }} className={classes.search}>
                            <Typography variant="h6" style={{ marginBottom: '10px', textAlign: 'center' }}>
                                Search for Friends
                            </Typography>
                            <p style={{ textAlign: 'center' }}>
                                You can either search by email address OR first name AND last name.
                            </p>
                            <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    variant={'outlined'}
                                    placeholder="Search (email)…"
                                    style={{ width: '400px' }}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                            <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    variant={'outlined'}
                                    placeholder="Search (first name)…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    value={first}
                                    onChange={e => {
                                        setFirstName(e.target.value);
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                                <TextField
                                    variant={'outlined'}
                                    placeholder="Search (last name)…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    value={last}
                                    onChange={e => {
                                        setLastName(e.target.value);
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>

                            <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    color="primary"
                                    style={{ width: '200px', marginTop: '10px' }}
                                    variant={'contained'}
                                    className={classes.searchButton}
                                    onClick={searchForFriend}
                                >
                                    Search
                                </Button>
                            </div>
                            <br />
                            <Divider />
                            <br />
                            {searchResults && (
                                <div>
                                    {searchResults.map((user, i) => (
                                        <div key={i}>
                                            <FriendCard
                                                auth={props.auth}
                                                button={true}
                                                user={user}
                                                makeFriend={(success, err) => {
                                                    if (success) {
                                                        setErrorMsg('Friend added');
                                                        setErrorOpen(true);
                                                        setErrorSeverity('success');
                                                    } else {
                                                        console.error(err);
                                                        setErrorMsg(
                                                            'Error: friend could not be added. Try again later.'
                                                        );
                                                        setErrorOpen(true);
                                                        setErrorSeverity('error');
                                                    }
                                                    fetchData();
                                                }}
                                                removeFriend={(success, err) => {
                                                    if (success) {
                                                        setErrorMsg('Friend removed');
                                                        setErrorOpen(true);
                                                        setErrorSeverity('success');
                                                    } else {
                                                        console.error(err);
                                                        setErrorMsg(
                                                            'Error: friend could not be removed. Try again later.'
                                                        );
                                                        setErrorOpen(true);
                                                        setErrorSeverity('error');
                                                    }
                                                    fetchData();
                                                }}
                                            />
                                            <br />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {searchResults.length === 0 && hasSearched && (
                                <div style={{ textAlign: 'center' }}>
                                    <Typography variant={'subtitle1'}>No results</Typography>
                                </div>
                            )}
                        </Paper>
                    </Grid>
                )}
            </Grid>
            <Snackbar
                open={errorOpen}
                autoHideDuration={5000}
                onClose={(_event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }

                    setErrorOpen(false);
                }}
                onExited={() => setErrorSeverity('error')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    variant="filled"
                    severity={errorSeverity}
                    onClose={() => {
                        setErrorOpen(false);
                    }}
                >
                    {errorMsg}
                </Alert>
            </Snackbar>
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
