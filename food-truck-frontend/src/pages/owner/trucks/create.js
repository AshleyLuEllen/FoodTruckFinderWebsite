import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import { Button, TextField, Container, Typography, CircularProgress, Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import ChipSelector from '../../../components/ChipSelector';
import Head from 'next/dist/next-server/lib/head';

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
        marginLeft: '20px',
    },
    progress: { position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12 },
});

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

            errorMsg: '',
            errorOpen: false,
            errorSeverity: 'error',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createNewTruck = this.createNewTruck.bind(this);
    }

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

    handleCancel() {
        this.props.router.push('/owner/trucks');
    }

    componentDidMount() {
        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
            .then(r => {
                this.setState({
                    allTags: r.data.filter(t => t.category !== 'payment'),
                    paymentTags: r.data.filter(t => t.category === 'payment'),
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg:
                        'Error: could not load possible truck tags! Check the console for more information. Feel free to create your truck with the remaining information, however.',
                    errorOpen: true,
                });
            });
    }

    createNewTruck() {
        this.setState({
            attemptingCreation: true,
        });

        if (this.state.name.length < 5) {
            this.setState({
                errorMsg: 'Invalid food truck name.',
                errorOpen: true,
                attemptingCreation: false,
            });
            return;
        }

        if (this.state.licensePlate.length < 3) {
            this.setState({
                errorMsg: 'Invalid license plate.',
                errorOpen: true,
                attemptingCreation: false,
            });
            return;
        }

        if (this.state.description.length < 5) {
            this.setState({
                errorMsg: 'Description must not be blank.',
                errorOpen: true,
                attemptingCreation: false,
            });
            return;
        }

        const truck = {
            licensePlate: this.state.licensePlate,
            description: this.state.description,
            name: this.state.name,
        };

        requests
            .postWithAuth(process.env.FOOD_TRUCK_API_URL + '/trucks', truck, this.props.auth)
            .then(res => {
                Promise.all(
                    this.state.truckTags.map(t =>
                        requests.postWithAuth(
                            `${process.env.FOOD_TRUCK_API_URL}/trucks/${res.data.id}/tags/${t.id}`,
                            {},
                            this.props.auth
                        )
                    ) +
                        this.state.paymentTruckTags.forEach(t =>
                            requests.postWithAuth(
                                `${process.env.FOOD_TRUCK_API_URL}/trucks/${res.data.id}/tags/${t.id}`,
                                {},
                                this.props.auth
                            )
                        )
                )
                    .then(() => {
                        this.props.router.push('/owner/trucks');
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                            errorMsg:
                                'Error: could not add the specified truck tags! Check the console for more information.',
                            errorOpen: true,
                            attemptingCreation: false,
                        });
                    });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg: 'Error: could not create your truck! Check the console for more information.',
                    errorOpen: true,
                    attemptingCreation: false,
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
                    <title>Create Truck</title>
                </Head>
                <Typography variant="h4" style={{ marginBottom: '10px' }}>
                    Create Truck {this.state.loading && <CircularProgress size={30} />}
                </Typography>
                <p>
                    Please fill out the information below to create your food truck. Don&apos;t worry about getting
                    everything perfect initially, all of this information can be changed later.
                </p>
                <TextField
                    className={classes.textField}
                    id="name"
                    variant="outlined"
                    label="Food Truck Name"
                    value={this.state.name}
                    fullWidth
                    onChange={e => this.handleInputChange(e, 'name')}
                    onBlur={() => this.setState({ name: this.state.name.trim() })}
                />
                <TextField
                    className={classes.textField}
                    variant="outlined"
                    id="licensePlate"
                    label="License Plate Number"
                    value={this.state.licensePlate}
                    fullWidth
                    onChange={e => this.handleInputChange(e, 'licensePlate')}
                    onBlur={() => this.setState({ licensePlate: this.state.licensePlate.trim() })}
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
                    onBlur={() => this.setState({ description: this.state.description.trim() })}
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
                <span style={{ position: 'relative' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.createNewTruck}
                        disabled={this.state.attemptingCreation}
                    >
                        Create
                    </Button>
                    {this.state.attemptingCreation && <CircularProgress className={classes.progress} size={24} />}
                </span>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    onClick={this.handleCancel}
                    href="/owner/trucks"
                    disabled={this.state.attemptingCreation}
                >
                    Cancel
                </Button>
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

CreateNewTruck.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
    classes: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default withStyles(pageStyles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateNewTruck))
);
