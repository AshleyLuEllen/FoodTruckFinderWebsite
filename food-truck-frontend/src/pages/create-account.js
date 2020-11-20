import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import withRouter from "next/dist/client/with-router";

import {Paper, withStyles, Grid, TextField, Button, Snackbar} from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit ,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(10),
            width: theme.spacing(35),
            height: theme.spacing(43),
        },
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        "& > *": {
            margin: theme.spacing(1)
        }
    }
});

class CreateAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {email: '', password: '', passConf:'', firstName:'', lastName:''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    handleChangeStatus(event) {
    }

    handleInputChange(event, name_of_attribute) {
        this.setState({
                [name_of_attribute]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    componentDidMount() {
    }

    createAccount(){
        const user = {
            emailAddress: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password
        }

        var pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)_])(?=.{8,})");
        const test = pattern.test(this.state.password);
        if (this.state.password === this.state.passConf) {
            if (test) {
                axios.post(process.env.FOOD_TRUCK_API_URL + "/users", user)
                    .then((res) => {
                        this.props.router.push('/login')
                    })
                    .catch((err) => {
                        alert("Email already exists.")
                        this.setState({
                            emailTaken: true
                        });
                        console.log(err);
                    });
            } else {
                this.setState({
                    badPass: true
                });
            }
        }
        else {
            this.setState({
                notMatchPass: true
            });
        }

        console.log("create account!");
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper elevation={3} alignItems="center">

                    <div className={classes.margin}>
                        <form onSubmit={this.handleSubmit} method="post">
                            <Grid container  alignItems="flex-end" justify="center">
                                <Grid item alignItems="center">
                                    <TextField value={this.state.email} onChange={e => this.handleInputChange(e, "email")} id="email" label="Email" type="email" autoFocus required/>
                                </Grid>
                            </Grid>
                            <Grid container  alignItems="flex-end" justify="center">
                                <Grid item alignItems="center">
                                    <TextField value={this.state.firstName} onChange={e => this.handleInputChange(e, "firstName")} id="firstName" label="First Name" required/>
                                </Grid>
                            </Grid>
                            <Grid container  alignItems="flex-end" justify="center">
                                <Grid item alignItems="center">
                                    <TextField value={this.state.lastName} onChange={e => this.handleInputChange(e, "lastName")} id="lastName" label="Last Name" required/>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="flex-end" justify="center">
                                <Grid item alignItems="center">
                                    <TextField value={this.state.password} onChange={e => this.handleInputChange(e, "password")} justify="center" id="password" label="Password" type="password" required/>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="flex-end" justify="center">
                                <Grid item alignItems="center">
                                    <TextField value={this.state.passConf} onChange={e => this.handleInputChange(e, "passConf")} justify="center" id="password" label="Confirm Password" type="password" required/>
                                </Grid>
                            </Grid>
                            <Grid container style={{ marginTop: '30px' }} justify="center">
                                <Button style={{ maxWidth: '160px', maxHeight: '40px', minWidth: '160px', minHeight: '40px'}} justify="center" variant="contained" color="primary" onClick={this.createAccount}>Create Account</Button>
                            </Grid>
                        </form>
                        <label>{this.state.message}</label>
                        {this.state.badPass && <Snackbar open={true} autoHideDuration={6000}>
                            <Alert variant="filled" severity="error">
                                Password must contain: <br />- at least 8 characters<br />
                                - at least 1 uppercase <br />- at least 1 lowercase<br />
                                - at least 1 number <br />- at least 1 special character (!@#$%^&*()_
                            </Alert>
                        </Snackbar>}
                        {this.state.emailTaken && <Snackbar open={true} autoHideDuration={6000}>
                            <Alert variant="filled" severity="error">
                                Email already taken.
                            </Alert>
                        </Snackbar>}
                        {this.state.notMatchPass && <Snackbar open={true} autoHideDuration={6000}>
                            <Alert variant="filled" severity="error">
                                Passwords do not match.
                            </Alert>
                        </Snackbar>}
                    </div>
                </Paper>
            </div>
        );
    }
}
export default withStyles(styles,{ withTheme: true })(withRouter(CreateAccount));