import React, { Component } from 'react';
import Link from "next/link";
import { withRouter } from 'next/router'
import axios from "axios";
import { connect, useDispatch } from 'react-redux';
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';
import LocationInput from '../components/LocationInput';

import { Paper, withStyles, Grid, TextField, Button, Snackbar, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

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
            height: theme.spacing(30),
        },
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        "& > *": {
            margin: theme.spacing(1)
        }
    },
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', loginFailed:false};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeStatus(event) {
    }
    handleInputChange(event, name_of_attribute) {
        this.setState({
                [name_of_attribute]: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault()

        console.log(this.state)
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/basicauth`, {
                auth: {
                    username: this.state.email,
                    password: this.state.password
                }
            })
            .then(res => {
                this.props.authLogin(this.state.email, this.state.password);
                this.props.router.push('/')
            })
            .catch(err => {
                this.setState({
                    loginFailed: true
                });
                this.props.authLogout();
                console.log(err)
            });
    }
    componentDidMount() {
    }

    createAccount = (e) => {
        this.props.router.push('/create-account');
    }


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper elevation={3} alignItems="center">

                <div className={classes.margin}>
                    <form onSubmit={this.handleSubmit}>
                    <Grid container  alignItems="flex-end" justify="center">
                        <Grid item alignItems="center">
                            <TextField onChange={e => this.handleInputChange(e, "email")} id="email" label="Email" type="email" autoFocus required/>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="flex-end" justify="center">
                        <Grid item alignItems="center">
                            <TextField onChange={e => this.handleInputChange(e, "password")} justify="center" id="password" label="Password" type="password" required/>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '30px' }} justify="center">
                        <Button style={{maxWidth: '160px', maxHeight: '40px', minWidth: '160px', minHeight: '40px'}} variant="contained" color="primary" type="submit">Sign In</Button>
                    </Grid>
                        <Grid container style={{ marginTop: '10px' }} justify="center">
                            <Button style={{ maxWidth: '160px', maxHeight: '40px', minWidth: '160px', minHeight: '40px'}} variant="contained" color="primary" onClick={this.createAccount}>Create Account</Button>
                        </Grid>
                    </form>
                    {this.state.loginFailed && <Snackbar open={true} autoHideDuration={6000}>
                        <Alert variant="filled" severity="error">
                            Invaild email and/or password.
                        </Alert>
                    </Snackbar>}
                </div>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
  }
  
const mapDispatchToProps = {
    authLogin,
    authLogout
}
export default withStyles(styles,{ withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Login)));