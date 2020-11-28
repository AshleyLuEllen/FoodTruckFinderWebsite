import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { geolocated } from 'react-geolocated';
import { withRouter } from 'next/router';
import * as requests from '../util/requests';
import { connect } from 'react-redux';
import { logout as authLogout } from '../redux/actions/auth';

import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Box, CircularProgress, Divider } from '@material-ui/core';

import GoogleMap, { Marker } from '../components/GoogleMap';
import TruckCard from '../components/TruckCard';
import SearchPage from './search';

const dashboardStyles = () => ({
    root: {
        marginTop: '20px',
    },
    mapWrapper: {
        position: 'relative',
        width: '100%',
        height: '87vh',
    },
    truckCard: {
        marginBottom: '5px',
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '87vh',
    },
    progress: {
        margin: '0 auto',
    },
});

class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: undefined,
            loading: true,
            user: undefined,
            subscriptions: [],
            recommendations: [],
            currentlySelected: undefined,
            positionUpdated: false,
        };
    }

    loadTrucks(userId) {
        Promise.all([
            requests._get(`${process.env.FOOD_TRUCK_API_URL}/users/${userId}/recommendations`),
            requests._get(`${process.env.FOOD_TRUCK_API_URL}/users/${userId}/subscriptions`),
        ])
            .then(results => {
                this.setState({
                    recommendations: results[0].data,
                    subscriptions: results[1].data,
                    loading: false,
                    currentlySelected: undefined,
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentDidUpdate(prevProps) {
        if (!this.state.positionUpdated && this.props.isGeolocationEnabled) {
            if (
                prevProps?.coords?.latitude !== this.props?.coords?.latitude ||
                prevProps?.coords?.longitude !== this.props?.coords?.longitude
            ) {
                if (this.props.coords?.latitude && this.props.coords?.longitude) {
                    const position = {
                        latitude: this.props?.coords?.latitude,
                        longitude: this.props?.coords?.longitude,
                    };
                    console.log(position);

                    this.setState({
                        positionUpdated: true,
                    });

                    requests
                        .putWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me/location`, position, this.props.auth)
                        .then(() => {
                            console.log('position updated');
                            this.loadTrucks(this.state.userId);
                        })
                        .catch(() => {
                            this.setState({
                                positionUpdated: false,
                            });
                        });
                }
            }
        }
    }

    componentDidMount() {
        requests
            .getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, this.props.auth)
            .then(userres => {
                this.setState(
                    {
                        userId: userres.data.id,
                    },
                    () => this.loadTrucks(this.state.userId)
                );
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { classes } = this.props;

        let markerCount = 0;
        const LETTERS = '12345ABCDE';

        return this.props.auth.isLoggedIn ? (
            <Container className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <div className={classes.mapWrapper}>
                            <GoogleMap
                                center={{
                                    lat: this.props?.coords?.latitude || 31.5489,
                                    lng: this.props?.coords?.longitude || -97.1131,
                                }}
                                withInfoWindow
                            >
                                {this.state.recommendations.map(
                                    (tr, i) =>
                                        tr.currentLocation && (
                                            <Marker
                                                key={i}
                                                position={{
                                                    lat: tr.currentLocation.latitude,
                                                    lng: tr.currentLocation.longitude,
                                                }}
                                                label={markerCount < 5 ? `${LETTERS[++markerCount]}` : undefined}
                                                title={tr.name}
                                                animation="drop"
                                            >
                                                <div className="title full-width">{tr.name}</div>
                                                <div className="address-line full-width">{tr.description}</div>
                                                <Link href={`/trucks/${tr.id}`}>View Truck Info Page</Link>
                                            </Marker>
                                        )
                                )}
                                {this.state.subscriptions.map(
                                    (tr, i) =>
                                        tr.currentLocation && (
                                            <Marker
                                                key={i}
                                                position={{
                                                    lat: tr.currentLocation.latitude,
                                                    lng: tr.currentLocation.longitude,
                                                }}
                                                label={markerCount < 10 ? `${LETTERS[++markerCount]}` : undefined}
                                                title={tr.name}
                                                animation="drop"
                                            >
                                                <div className="title full-width">{tr.name}</div>
                                                <div className="address-line full-width">{tr.description}</div>
                                                <Link href={`/trucks/${tr.id}`}>View Truck Info Page</Link>
                                            </Marker>
                                        )
                                )}
                                <Marker variant="circle"></Marker>
                            </GoogleMap>
                        </div>
                    </Grid>
                    {!this.state.loading && (
                        <Grid item xs={12} md={4}>
                            <Box style={{ textAlign: 'left', maxHeight: 'calc(87vh)', overflow: 'auto' }}>
                                {this.state.recommendations.length > 0 && (
                                    <Fragment>
                                        <Typography variant="h4" style={{ marginBottom: '10px', textAlign: 'center' }}>
                                            {this.state.user?.firstName}Recommendations
                                        </Typography>
                                        {this.state.recommendations.map((tr, i) => (
                                            <TruckCard
                                                key={i}
                                                className={classes.truckCard}
                                                truck={tr}
                                                tags={tr.tags.map(tag => tag.tag.name)}
                                                onClick={() => this.setState({ currentlySelected: i })}
                                                userId={this.state.userId}
                                            />
                                        ))}
                                        <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    </Fragment>
                                )}
                                <Typography variant="h4" style={{ marginBottom: '10px', textAlign: 'center' }}>
                                    {this.state.user?.firstName}Your Subscriptions
                                </Typography>
                                {this.state.subscriptions.map((tr, i) => (
                                    <TruckCard
                                        key={100 + i}
                                        className={classes.truckCard}
                                        truck={tr}
                                        tags={tr.tags.map(tag => tag.tag.name)}
                                        onClick={() =>
                                            this.setState({ currentlySelected: this.state.recommendations.length + i })
                                        }
                                        userId={this.state.userId}
                                    />
                                ))}
                            </Box>
                        </Grid>
                    )}
                    {this.state.loading && (
                        <Grid item xs={12} md={4}>
                            <div className={classes.progressContainer}>
                                <CircularProgress className={classes.progress} size="3.5rem" />
                            </div>
                        </Grid>
                    )}
                </Grid>
            </Container>
        ) : (
            <SearchPage {...this.props} />
        );
    }
}

DashboardPage.propTypes = {
    coords: PropTypes.any,
    isGeolocationEnabled: PropTypes.any,
    classes: PropTypes.any,
    auth: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogout,
};

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: null,
})(
    withStyles(dashboardStyles, { withTheme: true })(
        withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardPage))
    )
);
