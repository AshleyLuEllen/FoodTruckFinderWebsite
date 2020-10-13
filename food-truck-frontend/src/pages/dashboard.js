import React, { Component } from 'react';
import Link from "next/link";
import { withRouter } from 'next/router'
import axios from "axios";
import { connect } from 'react-redux';
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';

import TruckMap from '../components/TruckMap';
import SubscriptionCard from '../components/SubscriptionCard';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Box } from "@material-ui/core";

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
    }
});

class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = { trucks: [], currentlySelected: undefined };
    }
    
    componentDidMount() {
        // TODO: stub
        this.setState({
            trucks: [
                { name: "Test Food Truck 1", description: "A lighthearted eatery", id: 1, location: {lat: 37.759703, lng: -122.428093}, locationStr: "Sid Rich parking lot" },
                { name: "Test Food Truck 2", description: "A lighthearted eatery", id: 1, location: {lat: 37.759703, lng: -122.429093}, locationStr: "Sid Rich parking lot" },
                { name: "Test Food Truck 3", description: "A lighthearted eatery", id: 1, location: {lat: 37.759703, lng: -122.430093}, locationStr: "Sid Rich parking lot" },
                { name: "Test Food Truck 4", description: "A lighthearted eatery", id: 1, location: {lat: 37.759703, lng: -122.431093}, locationStr: "Sid Rich parking lot" },
                { name: "Test Food Truck 5", description: "A lighthearted eatery", id: 1, location: {lat: 37.759703, lng: -122.432093}, locationStr: "Sid Rich parking lot" },
                { name: "Test Food Truck 6", description: "A lighthearted eatery", id: 1, location: {lat: 37.759703, lng: -122.433093}, locationStr: "Sid Rich parking lot" },
            ],
            currentlySelected: 0
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <Container className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <div className={classes.mapWrapper}>
                            <TruckMap trucks={this.state.trucks} selected={this.state.currentlySelected}/>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h4" style={{ marginBottom: "10px", textAlign: "center" }}>Subscriptions</Typography>
                        <Box style={{ textAlign: "left", maxHeight: "calc(87vh - 50px)", overflow: "auto" }}>
                            {this.state.trucks.map((tr, i) => (
                                <SubscriptionCard className={classes.truckCard} truck={tr} onClick={evt => this.setState({currentlySelected: i})}/>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        );
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