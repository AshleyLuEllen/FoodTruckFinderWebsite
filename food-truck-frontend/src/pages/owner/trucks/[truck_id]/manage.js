import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { Button, TextField, Container, Grid, InputLabel } from '@material-ui/core';
import ChipSelector from '../../../../components/ChipSelector';

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class ManagePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: '',
            description: '',
            licensePlate: '',
            paymentTypes: 0,
            owner: '',
            allTags: [],
            truckTags: [],

            truckFound: false,
            menuOpen: false,
            anchor: null,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Sets the state value to the value in the form
     * @param event the source of the new value in the state
     * @param name_of_attribute
     */
    handleInputChange(event, name_of_attribute) {
        this.setState({
            [name_of_attribute]: event.target.value,
        });
    }

    handleTagChange(tag) {
        console.log(tag);
        this.setState({ truckTags: tag });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleCancel() {
        this.props.router.push(`/owner/trucks/${this.state.id}`);
    }

    /**
     * Saves the edited information from the form
     */
    saveInfo() {
        const truck = {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description,
            licensePlate: this.state.licensePlate,
            paymentTypes: Number(this.state.paymentTypes),
            owner: this.state.owner,
        };

        axios
            .put(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}`, truck)
            .then(res => {
                this.props.router.push(`/owner/trucks/${res.data.id}`).then(() => console.log('Truck Edited'));
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    /**
     * Removes the truck that's currently being edited
     */
    removeTruck() {
        axios
            .delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}`, {
                auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password,
                },
            })
            .then(res => {
                console.log(res.statusText);
                this.props.router.push('/owner/trucks').then();
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    /**
     * Displays all the information about the truck who's id is being
     * used in the URL
     */
    componentDidMount() {
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`)
            .then(res => {
                this.setState({
                    id: res.data.id,
                    name: res.data.name,
                    description: res.data.description,
                    licensePlate: res.data.licensePlate,
                    paymentTypes: 0,
                    owner: res.data.owner.id,

                    truckFound: true,
                    anchor: null,
                });
                console.log('found the truck!');
            })
            .catch(err => {
                console.log(err.message);
                this.setState({
                    id: 'empty',
                    name: 'empty',
                    description: 'empty',
                    licensePlate: 'empty',
                    paymentTypes: 0,
                    owner: 'empty',
                    truckFound: false,
                    anchor: null,
                });
            });

        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
            .then(r => {
                this.setState({
                    allTags: r.data,
                });
                axios
                    .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags`)
                    .then(r => {
                        this.setState({
                            truckTags: this.state.allTags.filter(t => r.data.findIndex(tt => tt.id === t.id) !== -1),
                        });
                    })
                    .catch(error => {
                        console.log(error.message);
                    });
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    /**
     * Continuously updates the truck information on the page
     */
    componentDidUpdate() {
        if (!this.state.truckFound) {
            axios
                .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`)
                .then(res => {
                    this.setState({
                        id: res.data.id,
                        name: res.data.name,
                        description: res.data.description,
                        licensePlate: res.data.licensePlate,
                        paymentTypes: res.data.paymentTypes,
                        owner: res.data.owner,

                        truckFound: true,
                        anchor: null,
                    });
                })
                .catch(() => {
                    this.setState({
                        id: '',
                        name: '',
                        description: '',
                        licensePlate: '',
                        paymentTypes: 0,
                        owner: '',

                        truckFound: false,
                        anchor: null,
                    });
                });

            // TODO: add all tags as well as truck tags to the state
            axios
                .get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
                .then(r => {
                    this.setState({
                        allTags: r.data,
                    });

                    axios
                        .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags`)
                        .then(r => {
                            this.setState({
                                truckTags: this.state.allTags.filter(
                                    t => r.data.findIndex(tt => tt.id === t.id) !== -1
                                ),
                            });
                        })
                        .catch(error => {
                            console.log(error.message);
                        });
                })
                .catch(error => {
                    console.log(error.message);
                });
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <h1>{this.state.name}</h1>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <InputLabel>Food Truck Name</InputLabel>
                            <TextField
                                id="name"
                                label=""
                                value={this.state.name}
                                fullWidth={true}
                                onChange={e => this.handleInputChange(e, 'name')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel>License Plate Number</InputLabel>
                            <TextField
                                id="licensePlate"
                                label=""
                                value={this.state.licensePlate}
                                fullWidth={true}
                                onChange={e => this.handleInputChange(e, 'licensePlate')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel>Description</InputLabel>
                            <TextField
                                id="description"
                                label=""
                                multiline
                                rows={4}
                                fullWidth={true}
                                defaultValue={this.state.description}
                                onChange={e => this.handleInputChange(e, 'description')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ChipSelector
                                label="Tags"
                                options={this.state.allTags}
                                selectedOptions={this.state.truckTags}
                                onChange={(event, value) => {
                                    this.handleTagChange(value);
                                }}
                                onSelectOption={t =>
                                    axios
                                        .post(
                                            `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}/tags/${t.id}`,
                                            {},
                                            {
                                                auth: {
                                                    username: this.props.auth.email,
                                                    password: this.props.auth.password,
                                                },
                                            }
                                        )
                                        .then()
                                        .catch(error => {
                                            console.log(error.message);
                                        })
                                }
                                onDeselectOption={t =>
                                    axios
                                        .delete(
                                            `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}/tags/${t.id}`,
                                            {
                                                auth: {
                                                    username: this.props.auth.email,
                                                    password: this.props.auth.password,
                                                },
                                            }
                                        )
                                        .then()
                                        .catch(error => {
                                            console.log(error.message);
                                        })
                                }
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button variant="outlined" color="primary" onClick={this.saveInfo} width={1 / 3}>
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button variant="outlined" color="secondary" onClick={this.removeTruck} width={1 / 3}>
                                Delete
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={this.handleCancel}
                                href={`/owner/trucks/${this.state.id}`}
                                width={1 / 3}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

ManagePage.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth };
};

const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManagePage));
