import React, { Component } from 'react';
import Link from "next/link";
import { withRouter } from 'next/router'
import axios from "axios";
import { connect, useDispatch } from 'react-redux';
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';
import LocationInput from '../components/LocationInput';

import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import { Face, Fingerprint } from '@material-ui/icons'

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
            height: theme.spacing(25),
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
    handleInputChange(event) {
        this.setState({
                [event.target.name]: event.target.value
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
                            <TextField id="email" label="Email" type="email" autoFocus required onChange={this.handleInputChange}/>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="flex-end" justify="center">
                        <Grid item alignItems="center">
                            <TextField justify="center" id="password" label="Password" type="password" required onChange={this.handleInputChange}/>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '30px' }} justify="space-between">
                        <Button  style={{ marginLeft:'10px', maxWidth: '85px', maxHeight: '40px', minWidth: '85px', minHeight: '40px'}} variant="contained" color="primary" type="submit">Sign In</Button>
                        <Button style={{ maxWidth: '160px', maxHeight: '40px', minWidth: '160px', minHeight: '40px'}} variant="contained" color="primary" onClick={this.createAccount}>Create Account</Button>
                    </Grid>
                    </form>
                </div>

                </Paper>
                <br />
                {this.state.loginFailed && <span>Login failed. Re-enter your username and password.</span>}


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