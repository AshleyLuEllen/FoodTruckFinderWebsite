import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import {
    CardContent,
    Chip,
    InputLabel,
    TextField,
    Typography,
    Button,
    Card,
    CardHeader,
    Divider,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Box,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';

import ReviewCard from '../../components/ReviewCard';
import Head from 'next/dist/next-server/lib/head';
import ScheduleCard from '../../components/ScheduleCard';

const truckPageStyles = theme => ({
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
        paddingTop: '16px',
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
        marginBottom: '20px',
        marginRight: '20px',
    },
    reviewDialog: {
        maxWidth: '500px',
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
        };

        this.toggleSubscribe = this.toggleSubscribe.bind(this);
        this.writeReview = this.writeReview.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.createReview = this.createReview.bind(this);
    }

    fetchData() {
        Promise.all([
            requests
                .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`)
                .then(res => {
                    this.setState({
                        truck: res.data,
                    });
                    return requests.get(
                        `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags`
                    );
                })
                .then(res2 => {
                    this.setState({
                        tags: res2.data,
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
                        // truckFound: true,
                    });
                    console.log('Got all information!');
                })
                .catch(() => {
                    this.setState({
                        truck: '',
                        tags: [],
                    });
                }),

            requests
                .getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, this.props.auth)
                .then(res => {
                    this.setState({
                        userId: res.data.id,
                    });
                    requests
                        .get(
                            `${process.env.FOOD_TRUCK_API_URL}/users/${res.data.id}/subscriptions/${this.props.router.query.truck_id}`
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
                        });
                })
                .catch(() => {
                    this.setState({
                        userId: undefined,
                    });
                }),
        ]).then(() => {
            this.setState({ truckFound: true, loadingInfo: false });
        });
    }

    writeReview() {
        this.setState({
            openReview: true,
        });
    }

    handleCancel() {
        this.setState({
            openReview: false,
            rating: 0,
            comment: '',
        });
    }

    createReview() {
        const review = {
            comment: this.state.reviewComment,
            rating: this.state.rating,
        };
        console.log(this.state.reviewComment);
        console.log(review.comment);
        requests
            .postWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/reviews`,
                review,
                this.props.auth
            )
            .then(() => {
                console.log('created review!');
            })
            .catch(err => console.log(err.message));

        this.setState({
            openReview: false,
            truckFound: false,
            rating: 0,
            comment: '',
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
        // this.fetchData();
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
            alert(
                'To subscribe to a food truck, you need to be logged in. Click the log-in button in the top right to log in or create an account.'
            );
        } else {
            if (!this.state.subscribed) {
                requests
                    .postWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/subscriptions/${this.state.truck.id}`,
                        {},
                        this.props.auth
                    )
                    .then(() => {
                        this.setState({
                            subscribed: true,
                        });
                    })
                    .catch(err => console.log(err));
            } else {
                requests
                    .deleteWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/subscriptions/${this.state.truck.id}`,
                        this.props.auth
                    )
                    .then(() => {
                        this.setState({
                            subscribed: false,
                        });
                    })
                    .catch(err => console.log(err));
            }
        }
    }

    render() {
        const { classes } = this.props;
        /**
         * display the information
         */
        return (
            <div>
                {/**TRUCK NAME*/}
                {this.state.truckFound && (
                    <div>
                        <Head>
                            <title>{this.state.truck.name}</title>
                        </Head>
                        <Typography variant="h2" align="center">
                            {this.state.truck.name}
                        </Typography>
                    </div>
                )}

                {/**TAGS*/}
                {this.state.truckFound && this.state.tags.length > 0 && (
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

                {/**RATING*/}
                {this.state.truckFound && this.state.truck.rating !== null && (
                    <div align="center">
                        <Rating name="rating" precision={0.5} value={this.state.truck.rating} size="medium" readOnly />
                    </div>
                )}

                {/**SUBSCRIBE BUTTON*/}
                {this.state.truckFound && this.state.userId && (
                    <div align="center">
                        <Box mt={1}>
                            <Button
                                color={this.state.subscribed ? 'secondary' : 'primary'}
                                variant="contained"
                                onClick={this.toggleSubscribe}
                            >
                                {this.state.subscribed ? 'Unsubscribe' : 'Subscribe'}
                            </Button>
                        </Box>
                    </div>
                )}

                {/**DESCRIPTION*/}
                {this.state.truckFound && (
                    <React.Fragment>
                        <Typography variant="h4" component="h2">
                            Description
                        </Typography>
                        <Typography variant="body1" component="p" className={classes.text}>
                            {this.state.truck.description}
                        </Typography>
                        <Divider />
                    </React.Fragment>
                )}

                {/**LICENSE*/}
                {this.state.truckFound && (
                    <React.Fragment>
                        <Typography variant="h4" component="h2">
                            License Plate
                        </Typography>
                        <Typography variant="body1" component="p" className={classes.text}>
                            {this.state.truck.licensePlate}
                        </Typography>
                        <Divider />
                    </React.Fragment>
                )}

                {/**OWNER*/}
                {this.state.truckFound && (
                    <React.Fragment>
                        <Typography variant="h4" component="h2">
                            Owner
                        </Typography>
                        <Typography variant="body1" component="p" className={classes.text}>
                            {this.state.truck.owner.firstName} {this.state.truck.owner.lastName}
                        </Typography>
                        <Divider />
                    </React.Fragment>
                )}

                <br />
                {/**SCHEDULE*/}
                {this.state.truckFound && this.state.schedules.length > 0 && (
                    <Card>
                        <CardHeader title={'Schedule'} />
                        <CardContent>
                            {this.state.truck.currentLocation && (
                                <Typography variant={'contained'}>
                                    Current Location: <strong>{this.state.truck.currentLocation?.location}</strong>
                                </Typography>
                            )}
                            {this.state.schedules.length > 0 && (
                                <ScheduleCard width={'900px'} schedules={this.state.schedules} />
                            )}
                        </CardContent>
                    </Card>
                )}
                <br />

                {/**REVIEWS*/}
                <Divider />
                {this.state.truckFound && this.state.reviews.length > 0 && (
                    <Card>
                        <CardHeader title={'Reviews'} />
                        <CardContent>
                            {this.state.reviews.map((r, i) => (
                                <ReviewCard className={truckPageStyles.reviewCard} key={i} r={r} user={false} />
                            ))}
                        </CardContent>
                    </Card>
                )}

                {this.state.truckFound && this.state.reviews.length === 0 && (
                    <Card>
                        <CardHeader title={'Reviews'} />
                        <CardContent>
                            <Typography variant="body1" component="p" className={classes.text}>
                                No reviews for <strong>{this.state.truck.name}</strong>
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                {this.state.truckFound && this.props.auth.isLoggedIn && (
                    <Button variant="contained" onClick={this.writeReview}>
                        <Typography variant="button" display="block" color={'primary'}>
                            Write Review
                        </Typography>
                    </Button>
                )}

                <Dialog fullWidth maxWidth="md" open={this.state.openReview} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Review for {this.state.truck.name}</DialogTitle>
                    <DialogContent>
                        <InputLabel>Rating</InputLabel>
                        <Box align={'left'} mt={1} ml={1}>
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
                        </Box>
                        <TextField
                            variant="outlined"
                            id="reviewComment"
                            label="Review Comment (optional)"
                            multiline
                            rows={4}
                            fullWidth={true}
                            value={this.state.reviewComment}
                            onChange={e => this.handleInputChange(e, null)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary" variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={this.createReview} color="primary" variant="contained">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/**BACK*/}
                <br />
                <Button variant="contained" href="/">
                    Back
                </Button>

                <div>
                    {this.state.truckFound &&
                        this.state.truck?.menu &&
                        (this.state.truck.menu.dataType === 'MENU_PDF' ? (
                            <object
                                data={this.state.truck.menu.url}
                                type="application/pdf"
                                width="750px"
                                height="750px"
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
            </div>
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
