import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import requests from '../../util/requests';
import isEmail from 'validator/lib/isEmail';
import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux';
import { logout as authLogout, authUpdate } from '../../redux/actions/auth';
import Head from 'next/dist/next-server/lib/head';

import {
    TextField,
    Container,
    Grid,
    Button,
    Typography,
    Avatar,
    Hidden,
    CircularProgress,
    Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
    root: {
        marginTop: '20px',
    },
    subheader: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    textField: {
        width: '300px',
        marginLeft: '0px',
        marginRight: '20px',
        marginTop: '10px',
        marginBottom: '20px',
    },
    bio: {
        width: '620px',
        maxWidth: '95%',
        marginBottom: '20px',
    },
    button: {
        display: 'block',
        width: '200px',
        height: 'auto',
        marginLeft: '0px',
        marginRight: '20px',
        marginBottom: '10px',
        textAlign: 'center',
    },
    avatarButton: {
        marginBottom: '20px',
        display: 'inline-block',
    },
    selectedFileText: {
        paddingBottom: '20px',
    },
    bigAvatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        fontSize: theme.spacing(10),
        margin: '0 auto',
        marginTop: theme.spacing(10),
    },
    removeAvatarButton: {
        display: 'block',
    },
    removeAvatarWrapper: {
        margin: '0 auto',
        marginTop: '10px',
    },
    buttonWrapper: {
        position: 'relative',
        width: '200px',
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function ManageAccountPage(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [confEmail, setConfEmail] = useState('');

    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const [user, setUser] = useState(undefined);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState(undefined);
    const [bio, setBio] = useState('');

    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorSeverity, setErrorSeverity] = useState('error');

    const avatarInputRef = useRef(null);

    useEffect(() => {
        requests
            .getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, props.auth)
            .then(res => {
                setEmail(res.data.emailAddress);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setBio(res.data.description);
                setUser(res.data);
            })
            .catch(() => {
                dispatch(props.authLogout());
                router.push('/');
            });
    }, []);

    function removeUserAvatar() {
        setLoadingDelete(true);
        requests
            .deleteWithAuth(`${process.env.FOOD_TRUCK_API_URL}/media/profiles/me`, props.auth)
            .then(() => requests.getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, props.auth))
            .then(res => {
                setUser(res.data);
                setLoadingDelete(false);
                setErrorSeverity('success');
                setErrorMsg('Avatar removed.');
                setErrorOpen(true);
            })
            .catch(err => {
                console.error(err);
                setErrorMsg('Error: avatar not removed! Check console for more information.');
                setErrorOpen(true);
                setLoadingDelete(false);
            });
    }

    function submitEmailChange() {
        if (email === confEmail) {
            if (isEmail(email)) {
                setLoadingEmail(true);
                requests
                    .patchWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/me`,
                        {
                            emailAddress: email,
                        },
                        props.auth
                    )
                    .then(() => {
                        setLoadingEmail(false);
                        dispatch(props.authLogout());
                        router.push('/login');
                    })
                    .catch(err => {
                        console.error(err);
                        setErrorMsg('Error: email address not changed! Check console for more information.');
                        setErrorOpen(true);
                        setLoadingEmail(false);
                    });
            } else {
                setErrorMsg('Email address is not valid.');
                setErrorOpen(true);
            }
        } else {
            setErrorMsg('Email addresses do not match.');
            setErrorOpen(true);
        }
    }

    function submitPasswordChange() {
        const passwordPat = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_])(?=.{8,})');

        if (password !== '' && password === confPassword) {
            if (passwordPat.test(password)) {
                setLoadingPassword(true);
                requests
                    .patchWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/me`,
                        {
                            password,
                        },
                        props.auth
                    )
                    .then(() => {
                        setLoadingPassword(false);
                        dispatch(props.authLogout());
                        router.push('/login');
                    })
                    .catch(err => {
                        console.error(err);
                        setErrorMsg('Error: password not changed! Check console for more information.');
                        setErrorOpen(true);
                        setLoadingPassword(false);
                    });
            } else {
                setErrorMsg('Password is not secure enough.');
                setErrorOpen(true);
            }
        } else {
            setErrorMsg('Passwords do not match.');
            setErrorOpen(true);
        }
    }

    function submitInfoChange() {
        setLoadingInfo(true);

        const formData = new FormData();
        formData.append('file', avatar);

        const list = [];

        if (avatar) {
            list.push(
                requests
                    .putWithAuth(`${process.env.FOOD_TRUCK_API_URL}/media/profiles/me`, formData, props.auth, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then(res => {
                        setUser({ ...user, avatar: res.data });
                    })
                    .catch(err => {
                        console.error(err);
                        setErrorMsg('Error: avatar not changed! Check console for more information.');
                        setErrorOpen(true);
                        setLoadingInfo(false);
                    })
            );
        }

        list.push(
            requests
                .patchWithAuth(
                    `${process.env.FOOD_TRUCK_API_URL}/users/me`,
                    {
                        firstName,
                        lastName,
                        description: bio,
                    },
                    props.auth
                )
                .then(() => {
                    console.log('Information changed!');
                })
                .catch(err => {
                    console.error(err);
                    setErrorMsg('Error: user info not changed! Check console for more information.');
                    setErrorOpen(true);
                    setLoadingInfo(false);
                })
        );

        Promise.all(list).then(() => {
            setLoadingInfo(false);
            setErrorSeverity('success');
            setErrorMsg('User information updated.');
            setErrorOpen(true);
        });
    }

    if (!props.auth.isLoggedIn) {
        router.push('/');
        return null;
    }

    return (
        <Container className={classes.root}>
            <Head>
                <title>Manage Account</title>
            </Head>
            <Typography variant="h4" style={{ marginBottom: '10px' }}>
                Manage Account
            </Typography>
            <Grid container>
                <Grid item xs={12} md={7}>
                    <Typography className={classes.subheader} variant="h5">
                        General Information
                    </Typography>
                    <TextField
                        className={classes.textField}
                        id="firstName"
                        label="First Name"
                        type="text"
                        variant="outlined"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        onBlur={() => setConfEmail(firstName.trim())}
                    />
                    <TextField
                        className={classes.textField}
                        id="lastName"
                        label="Last Name"
                        type="text"
                        variant="outlined"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        onBlur={() => setConfEmail(lastName.trim())}
                    />
                    <br />
                    <TextField
                        className={classes.bio}
                        multiline
                        rows={3}
                        id="bio"
                        label="Bio"
                        type="text"
                        variant="outlined"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        onBlur={() => setConfEmail(bio.trim())}
                    />
                    <input
                        id="file-input"
                        type="file"
                        hidden
                        ref={avatarInputRef}
                        accept="image/jpeg,image/png,image/gif"
                        onChange={e => setAvatar(e.target.files[0])}
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="file-input">
                            <Button
                                className={classes.button + ' ' + classes.avatarButton}
                                variant="contained"
                                component="span"
                            >
                                Upload Avatar
                            </Button>
                        </label>
                        {avatar && <div className={classes.selectedFileText}>{`Selected file: ${avatar.name}`}</div>}
                    </div>
                    <div className={classes.buttonWrapper}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={submitInfoChange}
                            disabled={loadingInfo || firstName === '' || lastName === ''}
                        >
                            Save Information
                        </Button>
                        {loadingInfo && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </Grid>
                <Hidden smDown>
                    <Grid item md={5}>
                        <Avatar
                            className={classes.bigAvatar}
                            alt={`${user?.firstName} ${user?.lastName}`}
                            src={user?.avatar?.url}
                        />
                        <Typography style={{ textAlign: 'center', marginTop: '10px' }} variant="h6">
                            Current Avatar
                        </Typography>
                        {user?.avatar && (
                            <div className={classes.buttonWrapper + ' ' + classes.removeAvatarWrapper}>
                                <Button
                                    className={classes.button + ' ' + classes.removeAvatarButton}
                                    variant="contained"
                                    color="secondary"
                                    onClick={removeUserAvatar}
                                    disabled={loadingDelete}
                                >
                                    Remove Avatar
                                </Button>
                                {loadingDelete && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>
                        )}
                    </Grid>
                </Hidden>
                <Grid item xs={12}>
                    <Typography className={classes.subheader} variant="h5">
                        Email Address
                    </Typography>
                    <p>
                        Please note that changing your email address will also change your login credentials.{' '}
                        <strong>This action will log you out of your account.</strong>
                    </p>
                    <TextField
                        className={classes.textField}
                        id="emailReset"
                        label="New Email Address"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="off"
                        onBlur={() => setConfEmail(email.trim())}
                    />
                    <TextField
                        className={classes.textField}
                        id="confEmailReset"
                        label="Confirm Email Address"
                        type="email"
                        variant="outlined"
                        value={confEmail}
                        onChange={e => setConfEmail(e.target.value)}
                        autoComplete="off"
                        onBlur={() => setConfEmail(confEmail.trim())}
                    />
                    <div className={classes.buttonWrapper}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={submitEmailChange}
                            disabled={loadingEmail || email !== confEmail}
                        >
                            Save Email Address
                        </Button>
                        {loadingEmail && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.subheader} variant="h5">
                        Password
                    </Typography>
                    <div>
                        Password must contain the following:
                        <ul style={{ margin: 0 }}>
                            <li>at least 1 lowercase letter</li>
                            <li>at least 1 uppercase letter</li>
                            <li>at least 1 digit</li>
                            <li>at least 1 special character (!@#$%^&*()_)</li>
                            <li>at least 8 characters</li>
                        </ul>
                    </div>
                    <p>
                        Please note that changing your password will also change your login credentials.{' '}
                        <strong>This action will log you out of your account.</strong>
                    </p>
                    <TextField
                        className={classes.textField}
                        id="passwordReset"
                        label="New Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="off"
                    />
                    <TextField
                        className={classes.textField}
                        id="confPasswordReset"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        value={confPassword}
                        onChange={e => setConfPassword(e.target.value)}
                        autoComplete="off"
                    />

                    <div className={classes.buttonWrapper}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={submitPasswordChange}
                            disabled={loadingPassword || password === '' || password !== confPassword}
                        >
                            Save Password
                        </Button>
                        {loadingPassword && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </Grid>
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

ManageAccountPage.propTypes = {
    auth: PropTypes.any,
    authLogout: PropTypes.func,
    authUpdate: PropTypes.func,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogout,
    authUpdate,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccountPage);
