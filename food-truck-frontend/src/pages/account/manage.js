import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import axios from "axios";

import { TextField, Container, Grid, Button } from "@material-ui/core";

import { useRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux';
import { logout as authLogout, authUpdate } from '../../redux/actions/auth';

function ManageAccountPage(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [confEmail, setConfEmail] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/user`, {
                auth: {
                    username: props.auth.email,
                    password: props.auth.password
                }
            })
            .then(res => {
                setEmail(res.data.emailAddress);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
            })
            .catch(err => {
                dispatch(props.authLogout());
                router.push("/");
            });
    }, []);

    function submitEmailChange() {
        if (email === confEmail) {
            axios
                .patch(`${process.env.FOOD_TRUCK_API_URL}/user`, {
                    emailAddress: email
                }, {
                    auth: {
                        username: props.auth.email,
                        password: props.auth.password
                    }
                })
                .then(res => {
                    alert("Email changed!");
                    dispatch(props.authUpdate(email, props.auth.password));
                })
                .catch(err => {
                    alert("Error: email not changed!");
                    alert(err);
                });
        } else {
            alert("Emails do not match");
        }
    }

    function submitPasswordChange() {
        if (props.auth.password === oldPassword && password !== "" && password === confPassword) {
            axios
                .patch(`${process.env.FOOD_TRUCK_API_URL}/user`, {
                    password
                }, {
                    auth: {
                        username: props.auth.email,
                        password: props.auth.password
                    }
                })
                .then(res => {
                    alert("Password changed!");
                    dispatch(props.authUpdate(props.auth.email, password));
                })
                .catch(err => {
                    alert(`Error: password not changed! ${err}`)
                });
        } else {
            alert("Passwords do not match");
        }
    }

    function submitNameChange() {
        axios
            .patch(`${process.env.FOOD_TRUCK_API_URL}/user`, {
                firstName,
                lastName
            }, {
                auth: {
                    username: props.auth.email,
                    password: props.auth.password
                }
            })
            .then(res => {
                alert("Name changed!");
            })
            .catch(err => {
                alert("Error: name not changed!")
            });
    }

    return (
        <Container>
            <h1>Manage Account</h1>
            <Grid container spacing={3} style={{textAlign:"center"}} justify="center">
                <Grid item xs={12} sm={6} md={4}>
                    <h2>Change Email Address</h2>
                    <TextField
                        id="email"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <br/>
                    <TextField
                        id="confEmail"
                        label="Confirm Email Address"
                        type="email"
                        value={confEmail}
                        onChange={e => setConfEmail(e.target.value)}
                    />
                    <br/>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        style={{width:"auto", height:"auto"}}
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
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                    />
                    <br/>
                    <TextField
                        id="password"
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <br/>
                    <TextField
                        id="confPassword"
                        label="Confirm Password"
                        type="password"
                        value={confPassword}
                        onChange={e => setConfPassword(e.target.value)}
                    />
                    <br/>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        style={{width:"auto", height:"auto"}}
                        onClick={submitPasswordChange}
                        disabled={props.auth.password !== oldPassword || password === "" || password !== confPassword}
                    >
                        Save Password
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <h2>Change Name</h2>
                    <TextField
                        id="firstName"
                        label="First Name"
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <TextField
                        id="lastName"
                        label="Last Name"
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                    <br/>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        style={{width:"auto", height:"auto"}}
                        onClick={submitNameChange}
                    >
                        Save Name
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}
  
const mapDispatchToProps = {
    authLogout,
    authUpdate
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ManageAccountPage);