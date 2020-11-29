import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../../util/requests';
import { login as authLogin, logout as authLogout } from '../../../redux/actions/auth';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { Typography, Button, Container, Grid } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

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
        this.state = { truckData: [] };
    }

    componentDidMount() {
        requests
            .getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, this.props.auth)
            .then(res => {
                this.setState({
                    owner: res.data.id,
                });

                let userID = this.state.owner;

                //let userID = 1;
                requests
                    .get(`${process.env.FOOD_TRUCK_API_URL}/users/${userID}/trucks`)
                    .then(res => {
                        this.setState({
                            truckData: res.data,
                        });
                    })
                    .catch(err => {
                        console.log(err.response?.status);
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err.response?.status);
                console.log(err);
            });
    }

    componentDidUpdate() {
        console.log(this.props.router.query);
        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.props.router.query.user_id}/trucks`)
            .then(res => {
                this.setState({
                    truckData: res.data,
                });
            })
            .catch(err => {
                console.log(err.response?.status);
                console.log(err);
            });
    }

    render() {
        const { classes } = this.props;
        return (
            <Container className={classes.root}>
                <Head>
                    <title>My Trucks</title>
                </Head>
                <Typography variant="h4" style={{ marginBottom: '0px' }}>
                    My Trucks
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
