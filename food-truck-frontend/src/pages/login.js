import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import axios from 'axios';
import { connect } from 'react-redux';
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';

import { Paper, withStyles, TextField, Button, Snackbar, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

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

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', loginFailed: false };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event, name_of_attribute) {
        this.setState({
            [name_of_attribute]: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/basicauth`, {
                auth: {
                    username: this.state.email,
                    password: this.state.password,
                },
            })
            .then(() => {
                this.props.authLogin(this.state.email, this.state.password);
                this.props.router.push('/');
            })
            .catch(err => {
                this.setState({
                    loginFailed: true,
                });
                this.props.authLogout();
                console.log(err);
            });
    }

    createAccount() {
        this.props.router.push('/create-account');
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation={3} alignItems="center">
                <Typography variant="h4" style={{ textAlign: 'center' }}>
                    Login
                </Typography>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        className={classes.text}
                        variant="outlined"
                        onChange={e => this.handleInputChange(e, 'email')}
                        id="email"
                        label="Email"
                        type="email"
                        autoFocus
                        required
                    />
                    <TextField
                        className={classes.text}
                        variant="outlined"
                        onChange={e => this.handleInputChange(e, 'password')}
                        justify="center"
                        id="password"
                        label="Password"
                        type="password"
                        required
                    />
                    <Button className={classes.button} variant="contained" color="primary" type="submit">
                        Sign In
                    </Button>
                    <Button className={classes.button} variant="contained" color="primary" onClick={this.createAccount}>
                        Create Account
                    </Button>
                </form>
                {this.state.loginFailed && (
                    <Snackbar
                        open={true}
                        autoHideDuration={6000}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert variant="filled" severity="error">
                            Invaild email and/or password.
                        </Alert>
                    </Snackbar>
                )}
            </Paper>
        );
    }
}

Login.propTypes = {
    authLogin: PropTypes.func,
    authLogout: PropTypes.func,
    classes: PropTypes.any,
    router: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogin,
    authLogout,
};
export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Login)));
