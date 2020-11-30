import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import {
    CardContent,
    Grid,
    TextField,
    Card,
    Button,
    Box,
    CardHeader,
    Typography,
    Container,
    CircularProgress,
    Snackbar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import ChipSelector from '../../../../components/ChipSelector';
import ScheduleCard from '../../../../components/ScheduleCard';
import Head from 'next/dist/next-server/lib/head';
import ReactMarkdown from 'react-markdown';

const pageStyles = () => ({
    root: {
        marginTop: '20px',
    },
    textField: {
        marginBottom: '20px',
    },
    tagSelector: {
        marginBottom: '20px',
    },
    button: {
        marginBottom: '20px',
        marginRight: '10px',
    },
});

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
        this.removeTruck = this.removeTruck.bind(this);
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
                    allTags: res5.data.filter(t => t.category !== 'payment'),
                    paymentTags: res5.data.filter(t => t.category === 'payment'),
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
                    loadingInfo: false,
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
        this.setState({ truckTags: tag });
    }

    handlePaymentTagChange(tag) {
        this.setState({ paymentTruckTags: tag });
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
        const { classes } = this.props;

        return (
            <Container className={classes.root}>
                <Head>
                    <title>Manage {this.state.truck.name}</title>
                </Head>
                <Typography variant="h4" style={{ marginBottom: '20px' }}>
                    Manage Truck {this.state.truck && `- ${this.state.truck.name}`}{' '}
                    {this.state.loadingInfo && <CircularProgress size={30} />}
                </Typography>
                {this.state.truckFound && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                href={`/trucks/${this.props.router.query.truck_id}`}
                            >
                                View Live Page
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                // color="primary"
                                href={`/owner/trucks/${this.props.router.query.truck_id}/notifications`}
                            >
                                Manage Notifications
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                // color="primary"
                                href={`/owner/trucks/${this.props.router.query.truck_id}/schedule`}
                            >
                                Manage Schedule
                            </Button>
                            <TextField
                                className={classes.textField}
                                id="name"
                                variant="outlined"
                                label="Food Truck Name"
                                value={this.state.name}
                                fullWidth
                                onChange={e => this.handleInputChange(e, 'name')}
                            />
                            <TextField
                                className={classes.textField}
                                variant="outlined"
                                id="licensePlate"
                                label="License Plate Number"
                                value={this.state.licensePlate}
                                fullWidth
                                onChange={e => this.handleInputChange(e, 'licensePlate')}
                            />
                            <TextField
                                // className={classes.textField}
                                id="description"
                                label="Description"
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                value={this.state.description}
                                onChange={e => this.handleInputChange(e, 'description')}
                            />
                            <ReactMarkdown>
                                The truck description supports **Markdown**! Learn more about it
                                [here](https://commonmark.org/help/).
                            </ReactMarkdown>
                            <div className={classes.tagSelector}>
                                <ChipSelector
                                    maxCount={5}
                                    label="Tags (select at most 5)"
                                    options={this.state.allTags}
                                    selectedOptions={this.state.truckTags}
                                    onChange={(event, value) => {
                                        this.handleTagChange(value);
                                    }}
                                />
                            </div>
                            <div className={classes.tagSelector}>
                                <ChipSelector
                                    maxCount={3}
                                    label="Payment Types (select at most 3)"
                                    options={this.state.paymentTags}
                                    selectedOptions={this.state.paymentTruckTags}
                                    onChange={(event, value) => {
                                        this.handlePaymentTagChange(value);
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    component="label"
                                    style={{ width: 'auto', height: 'auto' }}
                                >
                                    Upload Menu
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        ref={this.menuInputRef}
                                        accept="image/jpeg,image/png,image/gif,application/pdf"
                                        onChange={e => this.setState({ menu: e.target.files[0] })}
                                    />
                                </Button>
                                {this.state.menu && (
                                    <span
                                        style={{ marginBottom: '20px' }}
                                    >{`Selected file: ${this.state.menu.name}`}</span>
                                )}
                            </div>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={this.saveInfo}
                            >
                                Save Changes
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="secondary"
                                onClick={this.removeTruck}
                            >
                                Delete Truck (cannot be undone)
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" style={{ marginBottom: '10px' }}>
                                Schedules
                            </Typography>
                            {this.state.truck.currentLocation && (
                                <p>
                                    Current Location: <strong>{this.state.truck.currentLocation?.location}</strong>
                                </p>
                            )}
                            {this.state.schedules.length > 0 && <ScheduleCard schedules={this.state.schedules} />}
                            <Typography variant="h5" style={{ marginBottom: '10px', marginTop: '10px' }}>
                                Menu
                            </Typography>
                            <div style={{ width: '100%' }}>
                                {this.state.truck?.menu &&
                                    (this.state.truck.menu.dataType === 'MENU_PDF' ? (
                                        <object
                                            data={this.state.truck.menu.url}
                                            type="application/pdf"
                                            width="100%"
                                            height="500px"
                                        >
                                            <embed
                                                src={this.state.truck.menu.url}
                                                type="application/pdf"
                                                width="100%"
                                                height="100%"
                                            />
                                        </object>
                                    ) : (
                                        <img src={this.state.truck.menu.url} />
                                    ))}
                            </div>
                        </Grid>
                    </Grid>
                )}
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

Information.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
    classes: PropTypes.any,
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth };
};

const mapDispatchToProps = {};

export default withStyles(pageStyles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(Information))
);
