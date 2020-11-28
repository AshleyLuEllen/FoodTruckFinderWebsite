import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { Button, Grid, TextField, Box, Container } from '@material-ui/core';
import ChipSelector from '../../../components/ChipSelector';

class CreateNewTruck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            name: '',
            description: '',
            licensePlate: '',
            allTags: [],
            truckTags: [],
            paymentTags: [],
            paymentTruckTags: [],

            truckFound: false,
            menuOpen: false,
            anchor: null,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createNewTruck = this.createNewTruck.bind(this);
    }

    handleChangeStatus() {}

    handleInputChange(event, name_of_attribute) {
        this.setState({
            [name_of_attribute]: event.target.value,
        });
    }

    handleTagChange(tag) {
        if (tag.length < 6) {
            this.setState({ truckTags: tag });
        }
    }

    handlePaymentTagChange(tag) {
        if (tag.length < 3) {
            this.setState({ paymentTruckTags: tag });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleCancel() {
        this.props.router.push('/owner/trucks');
    }

    componentDidMount() {
        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
            .then(r => {
                this.setState({
                    allTags: r.data.filter(t => t.description !== 'payment'),
                    paymentTags: r.data.filter(t => t.description === 'payment'),
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    createNewTruck() {
        if (this.state.licensePlate.length < 1) {
            alert('Missing Information: License Plate Number');
            return;
        }
        if (this.state.name.length < 1) {
            alert('Missing Information: Food Truck Name');
            return;
        }

        const truck = {
            licensePlate: this.state.licensePlate,
            payment_types: 0,
            description: this.state.description,
            name: this.state.name,
        };

        requests
            .postWithAuth(process.env.FOOD_TRUCK_API_URL + '/trucks', truck, this.props.auth)
            .then(res => {
                this.state.truckTags.forEach(t => {
                    requests
                        .postWithAuth(
                            `${process.env.FOOD_TRUCK_API_URL}/trucks/${res.data.id}/tags/${t.id}`,
                            {},
                            this.props.auth
                        )
                        .then()
                        .catch(error => {
                            console.log(error.message);
                        });
                });
                this.state.paymentTruckTags.forEach(t => {
                    requests
                        .postWithAuth(
                            `${process.env.FOOD_TRUCK_API_URL}/trucks/${res.data.id}/tags/${t.id}`,
                            {},
                            this.props.auth
                        )
                        .then()
                        .catch(error => {
                            console.log(error.message);
                        });
                });
                this.props.router.push('/owner/trucks');
            })
            .catch(err => {
                alert(err);
                alert('Truck already exists.');
                console.log(err);
            });

        console.log('create truck!');
    }

    render() {
        return (
            <div>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <br />
                            <TextField
                                id="name"
                                variant="outlined"
                                label="Food Truck Name"
                                value={this.state.name}
                                fullWidth={true}
                                onChange={e => this.handleInputChange(e, 'name')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                id="licensePlate"
                                label="License Plate Number"
                                value={this.state.licensePlate}
                                fullWidth={true}
                                onChange={e => this.handleInputChange(e, 'licensePlate')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="description"
                                label="Description"
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth={true}
                                value={this.state.description}
                                onChange={e => this.handleInputChange(e, 'description')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ChipSelector
                                maxCount={5}
                                label="Tags (select at most 5)"
                                options={this.state.allTags}
                                selectedOptions={this.state.truckTags}
                                onChange={(event, value) => {
                                    this.handleTagChange(value);
                                }}
                            />
                            <br />
                            <ChipSelector
                                maxCount={2}
                                label="Payment Types (select at most 2)"
                                options={this.state.paymentTags}
                                selectedOptions={this.state.paymentTruckTags}
                                onChange={(event, value) => {
                                    this.handlePaymentTagChange(value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" onClick={this.createNewTruck} width={1 / 3}>
                                Create
                            </Button>
                            <Box mr={1} mt={1} mb={1}>
                                <Button
                                    variant="contained"
                                    onClick={this.handleCancel}
                                    href={'/owner/trucks'}
                                    width={1 / 3}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

CreateNewTruck.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateNewTruck));
