import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../util/requests';
import withRouter from 'next/dist/client/with-router';
import isEmail from 'validator/lib/isEmail';

import { Paper, withStyles, TextField, Button, Snackbar, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Head from 'next/dist/next-server/lib/head';

const styles = theme => ({
    root: {
        width: '360px',
        margin: '20px auto',
        padding: theme.spacing(2),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
            margin: '5px',
        },
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        width: '300px',
    },
    button: {
        width: '180px',
    },
});

class CreateAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            passConf: '',
            firstName: '',
            lastName: '',
            errorOpen: false,
            errorMsg: '',
            vertical: 'top',
            horizontal: 'center',
            triedCreate: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.handleErrorClose = this.handleErrorClose.bind(this);

        this.passwordPat = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_])(?=.{8,})');
    }

    handleInputChange(event, name_of_attribute) {
        this.setState({
            [name_of_attribute]: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleErrorClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            errorOpen: false,
        });
    }

    createAccount() {
        this.setState({
            triedCreate: true,
        });

        const user = {
            emailAddress: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
        };

        const test = this.passwordPat.test(this.state.password);
        if (this.state.email.length === 0) {
            this.setState({
                errorOpen: true,
                errorMsg: 'Email cannot be blank.',
            });
        } else if (!isEmail(this.state.email)) {
            this.setState({
                errorOpen: true,
                errorMsg: 'Invalid email address.',
            });
        } else if (this.state.firstName.length === 0) {
            this.setState({
                errorOpen: true,
                errorMsg: 'First name cannot be blank.',
            });
        } else if (this.state.lastName.length === 0) {
            this.setState({
                errorOpen: true,
                errorMsg: 'Last name cannot be blank.',
            });
        } else if (this.state.password.length === 0) {
            this.setState({
                errorOpen: true,
                errorMsg: 'Password cannot be blank.',
            });
        } else if (this.state.password === this.state.passConf) {
            if (test) {
                requests
                    .post(process.env.FOOD_TRUCK_API_URL + '/users', user)
                    .then(() => {
                        this.props.router.push('/login');
                    })
                    .catch(() => {
                        this.setState({
                            errorOpen: true,
                            errorMsg: 'Email already exists.',
                        });
                    });
            } else {
                this.setState({
                    errorOpen: true,
                    errorMsg: 'Password is not secure enough.',
                });
            }
        } else {
            this.setState({
                errorOpen: true,
                errorMsg: 'Passwords do not match.',
            });
        }

        console.log('create account!');
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation={3}>
                <Head>
                    <title>Create Account</title>
                </Head>
                <Typography variant="h4" style={{ textAlign: 'center' }}>
                    Create Account
                </Typography>
                <form className={classes.form} onSubmit={this.handleSubmit} method="post">
                    <TextField
                        className={classes.text}
                        variant="outlined"
                        value={this.state.email}
                        onChange={e => this.handleInputChange(e, 'email')}
                        id="email"
                        label="Email"
                        type="email"
                        helperText={
                            this.state.triedCreate && this.state.email.length === 0 && 'Email must not be blank'
                        }
                        autoFocus
                        required
                        error={this.state.triedCreate && this.state.email.length === 0}
                        onBlur={() => this.setState({ email: this.state.email.trim() })}
                    />
                    <TextField
                        className={classes.text}
                        variant="outlined"
                        value={this.state.firstName}
                        onChange={e => this.handleInputChange(e, 'firstName')}
                        id="firstName"
                        label="First Name"
                        helperText={
                            this.state.triedCreate &&
                            this.state.firstName.length === 0 &&
                            'First name must not be blank'
                        }
                        required
                        error={this.state.triedCreate && this.state.firstName.length === 0}
                        onBlur={() => this.setState({ firstName: this.state.firstName.trim() })}
                    />
                    <TextField
                        className={classes.text}
                        variant="outlined"
                        value={this.state.lastName}
                        onChange={e => this.handleInputChange(e, 'lastName')}
                        id="lastName"
                        label="Last Name"
                        helperText={
                            this.state.triedCreate && this.state.lastName.length === 0 && 'Last name must not be blank'
                        }
                        required
                        error={this.state.triedCreate && this.state.lastName.length === 0}
                        onBlur={() => this.setState({ lastName: this.state.lastName.trim() })}
                    />
                    <TextField
                        className={classes.text}
                        variant="outlined"
                        value={this.state.password}
                        onChange={e => this.handleInputChange(e, 'password')}
                        justify="center"
                        id="password"
                        label="Password"
                        type="password"
                        helperText={
                            this.state.triedCreate &&
                            (this.state.password.length === 0 || !this.passwordPat.test(this.state.password)) && (
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
                            )
                        }
                        required
                        error={
                            this.state.triedCreate &&
                            (this.state.password.length === 0 || !this.passwordPat.test(this.state.password))
                        }
                    />
                    <TextField
                        className={classes.text}
                        variant="outlined"
                        value={this.state.passConf}
                        onChange={e => this.handleInputChange(e, 'passConf')}
                        justify="center"
                        id="password"
                        label="Confirm Password"
                        type="password"
                        helperText={
                            this.state.triedCreate &&
                            (this.state.passConf.length === 0 || this.state.password !== this.state.passConf) &&
                            'Passwords must match'
                        }
                        required
                        error={
                            this.state.triedCreate &&
                            (this.state.passConf.length === 0 || this.state.password !== this.state.passConf)
                        }
                    />
                    <Button
                        className={classes.button}
                        justify="center"
                        variant="contained"
                        color="primary"
                        onClick={this.createAccount}
                    >
                        Create Account
                    </Button>
                </form>
                <label>{this.state.message}</label>
                <Snackbar
                    open={this.state.errorOpen}
                    autoHideDuration={6000}
                    onClose={this.handleErrorClose}
                    anchorOrigin={{ vertical: this.state.vertical, horizontal: this.state.horizontal }}
                >
                    <Alert variant="filled" severity="error" onClose={this.handleErrorClose}>
                        {this.state.errorMsg}
                    </Alert>
                </Snackbar>
            </Paper>
        );
    }
}

CreateAccount.propTypes = {
    router: PropTypes.any,
    classes: PropTypes.any,
};

export default withStyles(styles, { withTheme: true })(withRouter(CreateAccount));
