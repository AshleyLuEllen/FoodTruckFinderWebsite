import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { format } from 'date-fns';

import { Card, Button, Table, TableBody, TableRow, TableCell, Box } from '@material-ui/core';
import { ScheduleRounded as ScheduleIconRounded, MyLocation as MyLocationIcon } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { CardContent, Grid, TextField } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';

import ChipSelector from '../../../../components/ChipSelector';
import Head from "next/dist/next-server/lib/head";

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: '',
            description: '',
            licensePlate: '',
            truck: '',
            owner: '',
            schedules: [],
            avg_rating: -1,
            reviews: [],
            allTags: [],
            truckTags: [],
            paymentTruckTags: [],
            paymentTags: [],
            truckFound: false,
            loadingInfo: false,
            menu: undefined,
        };

        this.saveInfo = this.saveInfo.bind(this);
    }

    fetchData() {
        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`)
            .then(res => {
                this.setState({
                    truck: res.data,
                    owner: res.data.owner,
                    id: res.data.id,
                    name: res.data.name,
                    description: res.data.description,
                    licensePlate: res.data.licensePlate,
                });
                return requests.get(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`
                );
            })
            .then(res3 => {
                this.setState({
                    schedules: res3.data,
                });
                return requests.get(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/reviews`
                );
            })
            .then(res4 => {
                this.setState({
                    reviews: res4.data,
                });
                return requests.get(`${process.env.FOOD_TRUCK_API_URL}/tags`);
            })
            .then(res5 => {
                this.setState({
                    allTags: res5.data.filter(t => t.description !== 'payment'),
                    paymentTags: res5.data.filter(t => t.description === 'payment'),
                });
                return requests.get(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags`
                );
            })
            .then(res6 => {
                this.setState({
                    truckTags: this.state.allTags.filter(t => res6.data.findIndex(tt => tt.id === t.id) !== -1),
                    paymentTruckTags: this.state.paymentTags.filter(
                        t => res6.data.findIndex(tt => tt.id === t.id) !== -1
                    ),
                    truckFound: true,
                });
                console.log('Got all information!');
            })
            .catch(err => {
                console.log(err.message);
            });
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
        if (this.state.truckTags.length < 6) {
            this.setState({ truckTags: tag });
        }
    }

    handlePaymentTagChange(tag) {
        if (this.state.truckTags.length < 3) {
            this.setState({ paymentTruckTags: tag });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    /**
     * Saves the edited information from the form
     */
    saveInfo() {
        this.handleMenuUpload();

        if (this.state.licensePlate.length < 1) {
            alert('Missing Information: License Plate Number');
            return;
        }
        if (this.state.name.length < 1) {
            alert('Missing Information: Food Truck Name');
            return;
        }

        const truck = {
            id: this.props.router.query.truck_id,
            name: this.state.name,
            description: this.state.description,
            licensePlate: this.state.licensePlate,
            owner: this.state.owner,
        };
        console.log(truck);

        requests
            .put(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`, truck)
            .then(() => {
                console.log('Truck Edited');
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    /**
     * Removes the truck that's currently being edited
     */
    removeTruck() {
        requests
            .deleteWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`,
                this.props.auth
            )
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
    componentDidMount() {}

    /**
     * Continuously updates the truck information on the page
     */
    componentDidUpdate() {
        if (!this.state.truckFound && this.props.router.query.truck_id !== undefined && !this.state.loadingInfo) {
            this.setState({ loadingInfo: true });
            this.fetchData();
        }
    }

    handleMenuUpload() {
        if (!this.state.menu) {
            return;
        }

        const formData = new FormData();
        formData.append('file', this.state.menu);

        requests
            .putWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/menu`,
                formData,
                this.props.auth,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            .then(() => {
                console.log('Success');
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <Head>
                    <title>Manage {this.state.truck.name}</title>
                </Head>
                <br />
                <br />
                {this.state.truckFound && (
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                id="name"
                                label="Food Truck Name"
                                value={this.state.name}
                                fullWidth={true}
                                onChange={e => this.handleInputChange(e, 'name')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                id="licensePlate"
                                label="License Plate Number"
                                value={this.state.licensePlate}
                                fullWidth={true}
                                onChange={e => this.handleInputChange(e, 'licensePlate')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                id="description"
                                label="Description"
                                multiline
                                rows={4}
                                fullWidth={true}
                                value={this.state.description}
                                onChange={e => this.handleInputChange(e, 'description')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {/**Regular Tags**/}
                            <ChipSelector
                                maxCount={5}
                                label="Tags (select at most 5)"
                                options={this.state.allTags}
                                selectedOptions={this.state.truckTags}
                                onChange={(event, value) => {
                                    this.handleTagChange(value);
                                }}
                                onSelectOption={t => {
                                    if (this.state.truckTags.length < 5) {
                                        requests
                                            .postWithAuth(
                                                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags/${t.id}`,
                                                {},
                                                this.props.auth
                                            )
                                            .then()
                                            .catch(error => {
                                                console.log(error.message);
                                            });
                                    }
                                }}
                                onDeselectOption={t =>
                                    requests
                                        .deleteWithAuth(
                                            `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags/${t.id}`,
                                            this.props.auth
                                        )
                                        .then()
                                        .catch(error => {
                                            console.log(error.message);
                                        })
                                }
                            />
                            <br />
                            {/**Payment Tags**/}
                            <ChipSelector
                                maxCount={2}
                                label="Payment Types (select at most 2)"
                                options={this.state.paymentTags}
                                selectedOptions={this.state.paymentTruckTags}
                                onChange={(event, value) => {
                                    this.handlePaymentTagChange(value);
                                }}
                                onSelectOption={t => {
                                    if (this.state.paymentTruckTags.length < 2) {
                                        requests
                                            .postWithAuth(
                                                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags/${t.id}`,
                                                {},
                                                this.props.auth
                                            )
                                            .then()
                                            .catch(error => {
                                                console.log(error.message);
                                            });
                                    }
                                }}
                                onDeselectOption={t =>
                                    requests
                                        .deleteWithAuth(
                                            `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags/${t.id}`,
                                            this.props.auth
                                        )
                                        .then()
                                        .catch(error => {
                                            console.log(error.message);
                                        })
                                }
                            />
                            <div>
                                <Button variant="contained" component="label" style={{ width: 'auto', height: 'auto' }}>
                                    Upload Menu
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        ref={this.menuInputRef}
                                        accept="image/jpeg,image/png,image/gif,application/pdf"
                                        onChange={e => this.setState({ menu: e.target.files[0] })}
                                    />
                                </Button>
                                {this.state.menu && `Selected file: ${this.state.menu.name}`}
                            </div>
                            <Box mt={1} ml={1} mr={1} mb={1}>
                                <Button variant="contained" pt={10} pl={10} onClick={this.saveInfo}>
                                    Save
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box mt={1} ml={1} mr={1} mb={1}>
                                <Button
                                    variant="contained"
                                    pt={10}
                                    pl={10}
                                    href={`/owner/trucks/${this.props.router.query.truck_id}/notifications`}
                                >
                                    Manage Notifications
                                </Button>
                            </Box>
                            <Box mt={1} ml={1} mr={1} mb={1}>
                                <Button
                                    variant="contained"
                                    pt={10}
                                    pl={10}
                                    href={`/trucks/${this.props.router.query.truck_id}`}
                                >
                                    View Live Page
                                </Button>
                            </Box>
                            <Box mt={1} ml={1} mr={1} mb={1}>
                                <Button variant="contained" pt={10} pl={10} href="/owner/trucks">
                                    Back
                                </Button>
                            </Box>
                            <Box mt={1} ml={1} mr={1} mb={1}>
                                <Button variant="contained" pt={10} pl={10} href="/">
                                    Home
                                </Button>
                            </Box>
                            <br />
                            <Box mt={1} ml={1} mr={1} mb={1}>
                                <Button
                                    width={'50%'}
                                    variant="contained"
                                    pt={10}
                                    pl={10}
                                    color="secondary"
                                    onClick={this.removeTruck}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={9}>
                            {/**CURRENT LOCATION*/}
                            {this.state.truck.currentLocation && (
                                <div>
                                    <CardHeader title={'Current Location'} />
                                    <MyLocationIcon /> <strong>{this.state.truck.currentLocation?.location}</strong>
                                </div>
                            )}
                            {/**SCHEDULE*/}
                            <Card>
                                <CardHeader title={'Schedule'} />
                                <CardContent>
                                    {this.state.schedules.length > 0 &&
                                    <Table size="small">
                                        <TableBody>
                                            {this.state.schedules.map((s, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <Typography variant="body1">
                                                            <ScheduleIconRounded /> {s.location}:{' '}
                                                            {format(new Date(s.timeFrom), 'MM/dd/yyyy HH:mm')} to{' '}
                                                            {format(new Date(s.timeTo), 'MM/dd/yyyy HH:mm')}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>}
                                    <br />
                                    <Box mt={1} ml={1} mr={1} mb={1}>
                                        <Button
                                            variant="contained"
                                            href={`/owner/trucks/${this.props.router.query.truck_id}/schedule`}
                                        >
                                            <a>Manage Schedule</a>
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
}

Information.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth };
};

const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Information));
