import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import requests from '../../../util/requests';
import { format } from 'date-fns';
import { connect } from 'react-redux';

import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Avatar, Typography, Box, Button, Paper, CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import FriendAvatar from '../../../components/FriendAvatar';
import FriendAvatarGroup from '../../../components/FriendAvatarGroup';
import TruckCard from '../../../components/TruckCard';
import ReviewCard from '../../../components/ReviewCard';
import Head from 'next/dist/next-server/lib/head';

const styles = theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    bigAvatar: {
        width: theme.spacing(16),
        height: theme.spacing(16),
        fontSize: theme.spacing(10),
        margin: '0 auto',
    },
    truckCard: {
        marginBottom: '20px',
    },
    reviewCard: {
        marginBottom: '10px',
    },
    editButton: {
        width: 'auto',
        height: 'auto',
    },
    link: {
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            userID: undefined,
            found: false,
            isMe: false,
            friends: [],
            subscribedTrucks: [],
            viewerId: undefined,
            reviews: [],
            areFriends: false,
            errorMsg: '',
            errorOpen: false,
            errorSeverity: 'error',
        };
        this.fetchData = this.fetchData.bind(this);
        this.toggleFriendship = this.toggleFriendship.bind(this);
    }

    toggleFriendship() {
        if (!this.props.auth.isLoggedIn) {
            this.setState({
                errorMsg:
                    'To subscribe to a food truck, you need to be logged in. Click the log-in button in the top right to log in or create an account.',
                errorOpen: true,
            });
        } else {
            this.setState({
                loadingFriendship: true,
            });
            if (!this.state.areFriends) {
                requests
                    .postWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.props.auth.userId}/friends/${this.state.userID}`,
                        {},
                        this.props.auth
                    )
                    .then(() => {
                        this.setState({
                            errorMsg: 'Added friend successfully.',
                            errorOpen: true,
                            errorSeverity: 'success',
                            areFriends: true,
                            loadingFriendship: false,
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                            errorMsg: 'Error: could not add friendship! Check the console for more information.',
                            errorOpen: true,
                            loadingFriendship: false,
                        });
                    });
            } else {
                requests
                    .deleteWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.props.auth.userId}/friends/${this.state.userID}`,
                        this.props.auth
                    )
                    .then(() => {
                        this.setState({
                            errorMsg: 'Removed friend successfully.',
                            errorOpen: true,
                            errorSeverity: 'success',
                            areFriends: false,
                            loadingFriendship: false,
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                            errorMsg: 'Error: could not remove friendship! Check the console for more information.',
                            errorOpen: true,
                            loadingFriendship: false,
                        });
                    });
            }
        }
    }

    formatDate(dateStr) {
        if (!dateStr) {
            return undefined;
        }
        return format(new Date(dateStr), 'MMMM d, yyyy');
    }

    fetchData() {
        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userID}`)
            .then(res => {
                this.setState({
                    user: res.data,
                    found: true,
                    viewerId: this.props.auth.userId,
                });
                if (this.state.userID == this.props.auth.userId) {
                    this.setState({
                        isMe: true,
                    });
                } else if (this.props.auth.userId) {
                    requests
                        .get(
                            `${process.env.FOOD_TRUCK_API_URL}/users/${this.props.auth.userId}/friends/${this.state.userID}`
                        )
                        .then(() => this.setState({ areFriends: true }))
                        .catch(() => this.setState({ areFriends: false }));
                }
                return requests.get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userID}/subscriptions`);
            })
            .then(res => {
                this.setState({
                    subscribedTrucks: res.data,
                });
                return requests.get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userID}/reviews`);
            })
            .then(res => {
                this.setState({
                    reviews: res.data,
                });
                return requests.get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userID}/friends`);
            })
            .then(res => {
                this.setState({ friends: res.data });
            })
            .catch(err => {
                console.error(err);
                this.props.router.push('/404');
            });
    }

    componentDidMount() {
        this.setState({
            userID: this.props.router.query.user_id,
        });
    }

    componentDidUpdate() {
        if (!this.state.found) {
            if (this.state.userID === undefined) {
                if (this.props.router.query.user_id !== undefined) {
                    this.setState({
                        userID: this.props.router.query.user_id,
                    });
                }
            } else {
                this.fetchData();
            }
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Container style={{ marginTop: '20px', textAlign: 'center' }}>
                <Head>
                    <title>{this.state.user?.firstName}&apos;s Page</title>
                </Head>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Avatar
                            className={classes.bigAvatar}
                            alt={`${this.state.user?.firstName} ${this.state.user?.lastName}`}
                            src={this.state.user?.avatar?.url}
                        />
                        <Typography variant="h3" style={{ marginTop: '10px' }}>
                            {this.state.user?.firstName} {this.state.user?.lastName}
                        </Typography>
                        <Typography variant="subtitle2" style={{ fontStyle: 'italic' }}>
                            Member since {this.formatDate(this.state.user?.sinceTime)}
                        </Typography>
                        <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                            {this.state.user?.description || <em>This user has not set a bio.</em>}
                        </Typography>
                        {this.state.viewerId && this.state.isMe ? (
                            <Button
                                className={classes.editButton}
                                variant="contained"
                                color="primary"
                                href="/account/manage"
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <span style={{ position: 'relative' }}>
                                <Button
                                    className={classes.editButton}
                                    variant="contained"
                                    color={this.state.areFriends ? 'secondary' : 'primary'}
                                    onClick={this.toggleFriendship}
                                >
                                    {this.state.areFriends ? 'Remove friend' : 'Add friend'}
                                </Button>
                                {this.state.loadingSubscription && (
                                    <CircularProgress size={24} className={classes.buttonProgress} />
                                )}
                            </span>
                        )}
                        <Link href={`./${this.state.userID}/friends`}>
                            <Typography
                                variant="h4"
                                style={{ marginTop: '20px', marginBottom: '5px' }}
                                className={classes.link}
                            >
                                Friends
                            </Typography>
                        </Link>
                        <FriendAvatarGroup max={6} extraURL={`./${this.state.userID}/friends`}>
                            {this.state.friends.map((f, i) => (
                                <FriendAvatar key={i} user={f} />
                            ))}
                        </FriendAvatarGroup>
                        {this.state.friends.length === 0 && (
                            <Paper elevation={2} style={{ textAlign: 'center', padding: '20px' }}>
                                <em>This user has no friends yet. You can be the first!</em>
                            </Paper>
                        )}
                        <Typography variant="h4" style={{ marginTop: '20px', marginBottom: '5px' }}>
                            Reviews
                        </Typography>
                        <div style={{ height: '400px', overflow: 'auto' }}>
                            {this.state.reviews.map((r, i) => (
                                <ReviewCard className={classes.reviewCard} key={i} r={r} user={true} />
                            ))}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" style={{ marginTop: '20px', marginBottom: '5px' }}>
                            {this.state.user?.firstName}&apos;s Subscriptions
                        </Typography>
                        <Box style={{ textAlign: 'left', maxHeight: 700, overflow: 'auto' }}>
                            {this.state.subscribedTrucks.map((tr, i) => (
                                <TruckCard
                                    key={i}
                                    className={classes.truckCard}
                                    truck={tr}
                                    tags={tr.tags.map(tag => tag.tag.name)}
                                    userId={this.state.viewerId}
                                />
                            ))}
                        </Box>
                    </Grid>
                </Grid>
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

UserPage.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
    classes: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(withRouter(UserPage)));
