import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import requests from '../../../util/requests';
import { login as authLogin, logout as authLogout } from '../../../redux/actions/auth';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { Typography, Button, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import OwnerTruckCard from '../../../components/OwnerTruckCard';

const dashboardStyles = () => ({
    truckCard: {
        marginBottom: '5px',
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
            <div>
                <Typography variant={'h2'}>My Trucks</Typography>
                <ol>
                    {this.state.truckData.map((tr, i) => (
                        <OwnerTruckCard
                            key={i}
                            className={classes.truckCard}
                            truck={tr}
                            tags={tr.tags.map(tag => tag.tag.name)}
                            onClick={() => this.setState({ currentlySelected: i })}
                            userId={this.state.userId}
                        />
                    ))}
                </ol>
                {this.state.truckData.length > 0 && (
                    <Box ml={5}>
                        <Button variant={'contained'} href="/owner/trucks/create">
                            <AddIcon />
                        </Button>
                    </Box>
                )}
                {this.state.truckData.length === 0 && (
                    <Typography className={classes.links} variant={'button'}>
                        Click <Link href="/owner/trucks/create">here</Link> to add your first Truck!
                    </Typography>
                )}
            </div>
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
