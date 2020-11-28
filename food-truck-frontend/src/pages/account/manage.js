import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { TextField, Container, Grid, Button } from '@material-ui/core';

import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux';
import { logout as authLogout, authUpdate } from '../../redux/actions/auth';

function ManageAccountPage(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [confEmail, setConfEmail] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState(undefined);
    const [bio, setBio] = useState('');

    const avatarInputRef = useRef(null);

    useEffect(() => {
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
                auth: {
                    username: props.auth.email,
                    password: props.auth.password,
                },
            })
            .then(res => {
                setEmail(res.data.emailAddress);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setBio(res.data.description);
            })
            .catch(() => {
                dispatch(props.authLogout());
                router.push('/');
            });
    }, []);

    function submitEmailChange() {
        if (email === confEmail) {
            axios
                .patch(
                    `${process.env.FOOD_TRUCK_API_URL}/users/me`,
                    {
                        emailAddress: email,
                    },
                    {
                        auth: {
                            username: props.auth.email,
                            password: props.auth.password,
                        },
                    }
                )
                .then(() => {
                    alert('Email changed!');
                    dispatch(props.authUpdate(email, props.auth.password));
                })
                .catch(err => {
                    alert('Error: email not changed!');
                    alert(err);
                });
        } else {
            alert('Emails do not match');
        }
    }

    function submitPasswordChange() {
        if (props.auth.password === oldPassword && password !== '' && password === confPassword) {
            axios
                .patch(
                    `${process.env.FOOD_TRUCK_API_URL}/users/me`,
                    {
                        password,
                    },
                    {
                        auth: {
                            username: props.auth.email,
                            password: props.auth.password,
                        },
                    }
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

        axios
            .put(`${process.env.FOOD_TRUCK_API_URL}/media/profiles/me`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                auth: {
                    username: props.auth.email,
                    password: props.auth.password,
                },
            })
            .then(() => {
                console.log('Success');
            })
            .catch(err => {
                console.log(err);
            });

        axios
            .patch(
                `${process.env.FOOD_TRUCK_API_URL}/users/me`,
                {
                    firstName,
                    lastName,
                    description: bio,
                },
                {
                    auth: {
                        username: props.auth.email,
                        password: props.auth.password,
                    },
                }
            )
            .then(() => {
                alert('Information changed!');
            })
            .catch(() => {
                alert('Error: name not changed!');
            });
    }

    return (
        <Container>
            <h1>Manage Account</h1>
            <Grid container spacing={3} style={{ textAlign: 'center' }} justify="center">
                <Grid item xs={12} sm={6} md={4}>
                    <h2>Change Email Address</h2>
                    <TextField
                        id="email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <br />
                    <TextField
                        id="confEmail"
                        label="Confirm Email Address"
                        type="email"
                        variant="outlined"
                        value={confEmail}
                        onChange={e => setConfEmail(e.target.value)}
                    />
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: 'auto', height: 'auto' }}
                        onClick={submitEmailChange}
                        disabled={email !== confEmail}
                    >
                        Save Email Address
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <h2>Change Password</h2>
                    <TextField
                        id="oldPassword"
                        label="Old Password"
                        type="password"
                        variant="outlined"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                    />
                    <br />
                    <TextField
                        id="password"
                        label="New Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <br />
                    <TextField
                        id="confPassword"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        value={confPassword}
                        onChange={e => setConfPassword(e.target.value)}
                    />
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: 'auto', height: 'auto' }}
                        onClick={submitPasswordChange}
                        disabled={props.auth.password !== oldPassword || password === '' || password !== confPassword}
                    >
                        Save Password
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <h2>Change Information</h2>
                    <TextField
                        id="firstName"
                        label="First Name"
                        type="text"
                        variant="outlined"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <TextField
                        id="lastName"
                        label="Last Name"
                        type="text"
                        variant="outlined"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                    <br />
                    <TextField
                        id="bio"
                        label="Bio"
                        type="text"
                        variant="outlined"
                        style={{ width: '90%' }}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                    />
                    <div>
                        <Button variant="contained" component="label" style={{ width: 'auto', height: 'auto' }}>
                            Upload Avatar
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                ref={avatarInputRef}
                                accept="image/jpeg,image/png,image/gif"
                                onChange={e => setAvatar(e.target.files[0])}
                            />
                        </Button>
                        {avatar && `Selected file: ${avatar.name}`}
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: 'auto', height: 'auto' }}
                        onClick={submitInfoChange}
                    >
                        Save Information
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
