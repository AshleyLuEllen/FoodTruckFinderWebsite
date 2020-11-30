/* eslint-disable indent */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import {
    Chip,
    TextField,
    Typography,
    Button,
    Container,
    Divider,
    Paper,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Grid,
    Snackbar,
    CircularProgress,
} from '@material-ui/core';
import { Rating, Alert } from '@material-ui/lab';
import ReactMarkdown from 'react-markdown';

import ReviewCard from '../../components/ReviewCard';
import Head from 'next/dist/next-server/lib/head';
import ScheduleCard from '../../components/ScheduleCard';

const truckPageStyles = theme => ({
    root: {
        marginTop: '20px',
    },
    text: {
        marginLeft: theme.spacing(2),
        margin: theme.spacing(1),
    },
    truckTags: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    truckTag: {
        marginLeft: '5px',
        marginRight: '5px',
    },
    currentLocation: {
        fontSize: '20px',
    },
    ratingContainer: {
        display: 'flex',
        height: '50px',
        alignItems: 'left',
        justifyContent: 'center',
    },
    review: {
        fontSize: '14 px',
        marginBottom: 10,
        margin: theme.spacing(1),
    },
    reviewCard: {
        marginBottom: '10px',
    },
    reviewDialog: {
        maxWidth: '500px',
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class TruckPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            truck: '',
            tags: [],
            schedules: [],
            avg_rating: -1,
            reviews: [],
            openReview: false,
            subscribed: false,
            userId: false,

            reviewComment: '',
            rating: -1,

            truckFound: false,
            loadingInfo: false,
            loadingSubscription: false,
            loadingReview: false,

            errorMsg: '',
            errorOpen: false,
            errorSeverity: 'error',
        };

        this.toggleSubscribe = this.toggleSubscribe.bind(this);
        this.writeReview = this.writeReview.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.createReview = this.createReview.bind(this);
    }

    fetchData() {
        this.setState({ userId: this.props.auth?.userId });
        Promise.all([
            requests.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`).then(res =>
                this.setState({
                    truck: res.data,
                })
            ),
            requests
                .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags`)
                .then(res =>
                    this.setState({
                        tags: res.data,
                    })
                ),
            requests
                .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`)
                .then(res =>
                    this.setState({
                        schedules: res.data,
                    })
                ),
            requests
                .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/reviews`)
                .then(res => {
                    this.setState({
                        reviews: res.data,
                    });
                }),
            this.props.auth.userId
                ? requests
                      .get(
                          `${process.env.FOOD_TRUCK_API_URL}/users/${this.props.auth.userId}/subscriptions/${this.props.router.query.truck_id}`
                      )
                      .then(() => {
                          this.setState({
                              subscribed: true,
                          });
                      })
                      .catch(() => {
                          this.setState({
                              subscribed: false,
                          });
                      })
                : Promise.resolve(0),
        ])
            .then(() => {
                this.setState({ truckFound: true, loadingInfo: false });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg:
                        'Error: could not fetch truck info! Check the console for more information. Please try again later.',
                    errorOpen: true,
                });
            });
    }

    writeReview() {
        this.setState({
            openReview: true,
            rating: 0,
            comment: '',
        });
    }

    handleCancel() {
        this.setState({
            openReview: false,
        });
    }

    createReview() {
        this.setState({
            loadingReview: true,
        });

        const review = {
            comment: this.state.reviewComment,
            rating: this.state.rating,
        };

        requests
            .postWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/reviews`,
                review,
                this.props.auth
            )
            .then(() => {
                this.setState({
                    errorMsg: 'Posted review.',
                    errorOpen: true,
                    errorSeverity: 'success',
                    openReview: false,
                    loadingReview: false,
                });
                this.fetchData();
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg: 'Error: could not post review! Check the console for more information. Try again later.',
                    errorOpen: true,
                    loadingReview: false,
                });
            });
    }

    handleInputChange(e, value) {
        if (value == null) {
            this.setState({
                reviewComment: e.target.value,
            });
        } else {
            this.setState({
                rating: value,
            });
        }
    }

    /**
     * Displays all the information about the truck who's id is being
     * used in the URL
     */
    componentDidMount() {
        if (this.props.router?.query?.truck_id) this.fetchData();
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

    toggleSubscribe() {
        if (!this.props.auth.isLoggedIn) {
            this.setState({
                errorMsg:
                    'To subscribe to a food truck, you need to be logged in. Click the log-in button in the top right to log in or create an account.',
                errorOpen: true,
            });
        } else {
            this.setState({
                loadingSubscription: true,
            });
            if (!this.state.subscribed) {
                requests
                    .postWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/subscriptions/${this.state.truck.id}`,
                        {},
                        this.props.auth
                    )
                    .then(() => {
                        this.setState({
                            errorMsg: 'Subscribed to food truck successfully.',
                            errorOpen: true,
                            errorSeverity: 'success',
                            subscribed: true,
                            loadingSubscription: false,
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                            errorMsg:
                                'Error: could not subscribe to food truck! Check the console for more information.',
                            errorOpen: true,
                            loadingSubscription: false,
                        });
                    });
            } else {
                requests
                    .deleteWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/subscriptions/${this.state.truck.id}`,
                        this.props.auth
                    )
                    .then(() => {
                        this.setState({
                            errorMsg: 'Unsubscribed to food truck successfully.',
                            errorOpen: true,
                            errorSeverity: 'success',
                            subscribed: false,
                            loadingSubscription: false,
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                            errorMsg:
                                'Error: could not unsubscribe from food truck! Check the console for more information.',
                            errorOpen: true,
                            loadingSubscription: false,
                        });
                    });
            }
        }
    }

    render() {
        const { classes } = this.props;
        /**
         * display the information
         */
        return (
            <Container className={classes.root}>
                {this.state.truckFound && (
                    <div>
                        {/**TRUCK NAME*/}
                        <Head>
                            <title>{this.state.truck.name}</title>
                        </Head>
                        <Typography variant="h2" align="center">
                            {this.state.truck.name}
                        </Typography>

                        {/**TAGS*/}
                        {this.state.tags.length > 0 && (
                            <div align="center" className={classes.truckTags}>
                                {this.state.tags.map((t, i) => (
                                    <Chip
                                        onClick={() =>
                                            this.props.router.push({
                                                pathname: '/search',
                                                query: { tag: t },
                                            })
                                        }
                                        className={classes.truckTag}
                                        key={i}
                                        label={t.name}
                                    />
                                ))}
                            </div>
                        )}

                        {/**SUBSCRIBE BUTTON*/}
                        {this.props.auth.isLoggedIn && (
                            <div
                                style={{
                                    marginTop: '10px',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {this.state.truck.rating !== null && (
                                    <Rating
                                        style={{ marginRight: '25px' }}
                                        name="rating"
                                        precision={0.5}
                                        value={this.state.truck.rating}
                                        size="medium"
                                        readOnly
                                    />
                                )}
                                <span style={{ position: 'relative' }}>
                                    <Button
                                        color={this.state.subscribed ? 'secondary' : 'primary'}
                                        variant="contained"
                                        onClick={this.toggleSubscribe}
                                        disabled={this.state.loadingSubscription}
                                    >
                                        {this.state.subscribed ? 'Unsubscribe' : 'Subscribe'}
                                    </Button>
                                    {this.state.loadingSubscription && (
                                        <CircularProgress size={24} className={classes.buttonProgress} />
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {this.state.truckFound && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <div style={{ marginTop: '20px', fontSize: '20px' }}>
                                <ReactMarkdown>{this.state.truck?.description}</ReactMarkdown>
                            </div>
                            <Divider />
                            <Typography variant="h5" style={{ marginBottom: '10px', marginTop: '10px' }}>
                                Menu
                            </Typography>
                            <div style={{ width: '100%' }}>
                                {this.state.truck?.menu ? (
                                    this.state.truck.menu.dataType === 'MENU_PDF' ? (
                                        <object
                                            data={this.state.truck.menu.url}
                                            type="application/pdf"
                                            width="100%"
                                            height="650px"
                                        >
                                            <embed
                                                src={this.state.truck.menu.url}
                                                type="application/pdf"
                                                width="100%"
                                                height="100%"
                                            />
                                        </object>
                                    ) : (
                                        <img src={this.state.truck.menu.url} style={{ width: '100%' }} />
                                    )
                                ) : (
                                    <Paper elevation={2} style={{ textAlign: 'center', padding: '20px' }}>
                                        <em>This truck has not posted a menu.</em>
                                    </Paper>
                                )}
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" style={{ marginTop: '20px', marginBottom: '10px' }}>
                                Schedule
                            </Typography>
                            {this.state.truck.currentLocation && (
                                <p>
                                    Current Location: <strong>{this.state.truck.currentLocation?.location}</strong>
                                </p>
                            )}
                            {this.state.schedules.length > 0 && <ScheduleCard schedules={this.state.schedules} />}
                            <Typography
                                variant="h5"
                                style={{
                                    marginTop: '20px',
                                    marginBottom: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span>Reviews</span>
                                {this.props.auth.isLoggedIn && (
                                    <Button variant="contained" color="primary" onClick={this.writeReview}>
                                        Write Review
                                    </Button>
                                )}
                            </Typography>
                            {this.state.reviews.length > 0 ? (
                                <div style={{ height: '400px', overflow: 'auto' }}>
                                    {this.state.reviews.map((r, i) => (
                                        <ReviewCard className={classes.reviewCard} key={i} r={r} user={false} />
                                    ))}
                                </div>
                            ) : (
                                <Paper elevation={2} style={{ textAlign: 'center', padding: '20px' }}>
                                    <em>This truck has not been reviewed yet. You can be the first!</em>
                                </Paper>
                            )}
                        </Grid>
                    </Grid>
                )}

                <Dialog fullWidth maxWidth="sm" open={this.state.openReview} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Rate and review {this.state.truck.name}</DialogTitle>
                    <DialogContent>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start',
                                marginBottom: '20px',
                            }}
                        >
                            <span style={{ fontSize: '16px', marginRight: '10px' }}>Rating</span>
                            <Rating
                                align="left"
                                name="preferredRating"
                                precision={0.5}
                                value={this.state.rating}
                                onChange={(event, newValue) => {
                                    this.handleInputChange(event, newValue);
                                }}
                                size="medium"
                            />
                        </div>
                        <TextField
                            variant="outlined"
                            id="reviewComment"
                            label="Review Comment (optional)"
                            multiline
                            rows={4}
                            fullWidth={true}
                            value={this.state.reviewComment}
                            onChange={e => this.handleInputChange(e, null)}
                            onBlur={() => this.setState({ reviewComment: this.state.reviewComment.trim() })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="secondary" variant="contained">
                            Cancel
                        </Button>
                        <span style={{ position: 'relative' }}>
                            <Button
                                onClick={this.createReview}
                                color="primary"
                                disabled={this.state.loadingReview}
                                variant="contained"
                            >
                                Submit
                            </Button>
                            {this.state.loadingReview && (
                                <CircularProgress size={24} className={classes.buttonProgress} />
                            )}
                        </span>
                    </DialogActions>
                </Dialog>
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

TruckPage.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
    classes: PropTypes.any,
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth };
};

const mapDispatchToProps = {};

export default withStyles(truckPageStyles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(TruckPage))
);
