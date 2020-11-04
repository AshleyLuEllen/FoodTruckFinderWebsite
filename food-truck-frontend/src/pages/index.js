import React, { Component } from 'react';
import Link from "next/link";
import { withRouter } from 'next/router'
import axios from "axios";
import { connect } from 'react-redux';
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';

import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Box, CircularProgress, Divider } from "@material-ui/core";

import TruckMap from '../components/TruckMap';
import SubscriptionCard from '../components/SubscriptionCard';
import { Search } from '@material-ui/icons';
import SearchPage from './search';

const dashboardStyles = theme => ({
    root: {
        marginTop: '20px'
    },
    mapWrapper: {
        position: 'relative',
        width: '100%',
        height: '87vh'
    },
    truckCard: {
        marginBottom: '5px'
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '87vh'
    },
    progress: {
        margin: '0 auto'
    }
});

class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, user: undefined, subscriptions: [], recommendations: [], currentlySelected: undefined };
    }

    componentDidMount() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/me`,
            {
                auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }
            })
            .then(userres => {
                Promise.all([
                    axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${userres.data.id}/recommendations`),
                    axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${userres.data.id}/subscriptions`)
                ])
                .then(results => {
                    this.setState({
                        recommendations: results[0].data,
                        subscriptions: results[1].data,
                        loading: false,
                        currentlySelected: undefined
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { classes } = this.props;

        return this.props.auth.isLoggedIn ? (
            <Container className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <div className={classes.mapWrapper}>
                            <TruckMap trucks={this.state.recommendations.concat(this.state.subscriptions)} selected={this.state.currentlySelected}/>
                        </div>
                    </Grid>
                    {!this.state.loading &&
                        <Grid item xs={12} md={4}>
                            <Box style={{ textAlign: "left", maxHeight: "calc(87vh)", overflow: "auto" }}>
                                <Typography variant="h4" style={{ marginBottom: "10px", textAlign: "center" }}>{this.state.user?.firstName}Recommendations</Typography>
                                {this.state.recommendations.map((tr, i) => (
                                    <SubscriptionCard className={classes.truckCard} truck={tr} onClick={evt => this.setState({currentlySelected: i})}/>
                                ))}
                                <Divider style={{ marginTop: "10px", marginBottom: "10px" }}/>
                                <Typography variant="h4" style={{ marginBottom: "10px", textAlign: "center" }}>{this.state.user?.firstName}Your Subscriptions</Typography>
                                {this.state.subscriptions.map((tr, i) => (
                                    <SubscriptionCard className={classes.truckCard} truck={tr} onClick={evt => this.setState({currentlySelected: this.state.recommendations.length + i})}/>
                                ))}
                            </Box>
                        </Grid>
                    }
                    {this.state.loading &&
                        <Grid item xs={12} md={4}>
                            <div className={classes.progressContainer}>
                                <CircularProgress className={classes.progress} size="3.5rem"/>
                            </div>
                        </Grid>
                    }
                </Grid>
            </Container>
        ) : <SearchPage {...this.props}/>;
    }
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}

const mapDispatchToProps = {
    authLogout
}

export default withStyles(dashboardStyles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardPage)));