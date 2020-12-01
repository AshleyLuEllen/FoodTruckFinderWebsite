import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../../util/requests';
import { login as authLogin, logout as authLogout } from '../../../redux/actions/auth';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { Typography, Button, Container, Grid, Snackbar, CircularProgress } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import OwnerTruckCard from '../../../components/OwnerTruckCard';
import Head from 'next/dist/next-server/lib/head';

const dashboardStyles = () => ({
    root: {
        marginTop: '20px',
    },
    truckCard: {
        margin: '10px',
    },
    links: {
        marginLeft: '35px',
    },
});

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            truckData: [],
            loading: true,
        };
    }

    componentDidMount() {
        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.props.auth.userId}/trucks`)
            .then(res => {
                this.setState({
                    truckData: res.data,
                    loading: false,
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg: 'Error: could not load your trucks! Check the console for more information.',
                    errorOpen: true,
                    loading: false,
                });
            });
    }

    render() {
        if (!this.props.auth.isLoggedIn) {
            this.props.router.push('/');
            return null;
        }

        const { classes } = this.props;
        return (
            <Container className={classes.root}>
                <Head>
                    <title>My Trucks</title>
                </Head>
                <Typography variant="h4" style={{ marginBottom: '0px' }}>
                    My Trucks {this.state.loading && <CircularProgress size={30} />}
                </Typography>
                <Grid container>
                    {this.state.truckData.map((tr, i) => (
                        <Grid item xs={12} md={6} key={i}>
                            <OwnerTruckCard
                                className={classes.truckCard}
                                truck={tr}
                                tags={tr.tags.map(tag => tag.tag.name)}
                                onClick={() => this.setState({ currentlySelected: i })}
                                userId={this.state.userId}
                            />
                        </Grid>
                    ))}
                    {this.state.truckData.length === 0 && (
                        <Grid item xs={12}>
                            <p>Click the button below to create a new truck.</p>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ margin: '10px' }}
                            href="/owner/trucks/create"
                        >
                            <AddIcon style={{ marginRight: '5px' }} />
                            Create new truck
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar
                    open={this.state.errorOpen}
                    autoHideDuration={5000}
                    onClose={(_event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }

                        this.setState({
                            errorOpen: false,
                        });
                    }}
                    onExited={() => this.setState({ errorSeverity: 'error' })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        variant="filled"
                        severity={this.state.errorSeverity}
                        onClose={() => {
                            this.setState({
                                errorOpen: false,
                            });
                        }}
                    >
                        {this.state.errorMsg}
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
}

Dashboard.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
    classes: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogin,
    authLogout,
};

export default withStyles(dashboardStyles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
);
