import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import requests from '../../util/requests';
import isEmail from 'validator/lib/isEmail';
import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux';
import { logout as authLogout, authUpdate } from '../../redux/actions/auth';

import { TextField, Container, Grid, Button, Typography, Avatar, Hidden } from '@material-ui/core';
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
        margin: '0 auto',
        marginTop: '10px',
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
        requests
            .deleteWithAuth(`${process.env.FOOD_TRUCK_API_URL}/media/profiles/me`, props.auth)
            .then(() => requests.getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, props.auth))
            .then(res => setUser(res.data))
            .catch(() => alert('removed profile'));
    }

    function submitEmailChange() {
        if (email === confEmail) {
            requests
                .patchWithAuth(
                    `${process.env.FOOD_TRUCK_API_URL}/users/me`,
                    {
                        emailAddress: email,
                    },
                    props.auth
                )
                .then(() => {
                    alert('Email changed!');
                    dispatch(props.authUpdate(email, props.auth.password));
                })
                .then(() => {})
                .catch(err => {
                    alert('Error: email not changed!');
                    alert(err);
                });
        } else {
            alert('Emails do not match');
        }
    }

    function submitPasswordChange() {
        if (password !== '' && password === confPassword) {
            requests
                .patchWithAuth(
                    `${process.env.FOOD_TRUCK_API_URL}/users/me`,
                    {
                        password,
                    },
                    props.auth
                )
                .then(() => {
                    alert('Password changed!');
                    dispatch(props.authUpdate(props.auth.email, password));
                })
                .catch(err => {
                    alert(`Error: password not changed! ${err}`);
                });
        } else {
            alert('Passwords do not match');
        }
    }

    function submitInfoChange() {
        const formData = new FormData();
        formData.append('file', avatar);

        if (avatar) {
            requests
                .putWithAuth(`${process.env.FOOD_TRUCK_API_URL}/media/profiles/me`, formData, props.auth, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(() => {
                    console.log('Success');
                })
                .catch(err => {
                    console.log(err);
                });
        }

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
                alert('Information changed!');
            })
            .catch(() => {
                alert('Error: name not changed!');
            });
    }

    return (
        <Container className={classes.root}>
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
                    />
                    <TextField
                        className={classes.textField}
                        id="lastName"
                        label="Last Name"
                        type="text"
                        variant="outlined"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
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
                    <Button className={classes.button} variant="contained" color="primary" onClick={submitInfoChange}>
                        Save Information
                    </Button>
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
                            <Button
                                className={classes.button + ' ' + classes.removeAvatarButton}
                                variant="contained"
                                color="secondary"
                                onClick={removeUserAvatar}
                            >
                                Remove Avatar
                            </Button>
                        )}
                    </Grid>
                </Hidden>
                <Grid item xs={12}>
                    <Typography className={classes.subheader} variant="h5">
                        Email Address
                    </Typography>
                    <p>
                        Please note that changing your email address will also change your login credentials.
                        <strong>This action will log you out of your account.</strong>
                    </p>
                    <TextField
                        className={classes.textField}
                        id="email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        className={classes.textField}
                        id="confEmail"
                        label="Confirm Email Address"
                        type="email"
                        variant="outlined"
                        value={confEmail}
                        onChange={e => setConfEmail(e.target.value)}
                    />
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={submitEmailChange}
                        disabled={email !== confEmail}
                    >
                        Save Email Address
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.subheader} variant="h5">
                        Password
                    </Typography>
                    <p>
                        Please note that changing your password will also change your login credentials.
                        <strong>This action will log you out of your account.</strong>
                    </p>
                    <TextField
                        className={classes.textField}
                        id="password"
                        label="New Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <TextField
                        className={classes.textField}
                        id="confPassword"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        value={confPassword}
                        onChange={e => setConfPassword(e.target.value)}
                    />
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={submitPasswordChange}
                        disabled={password === '' || password !== confPassword}
                    >
                        Save Password
                    </Button>
                </Grid>
            </Grid>
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
