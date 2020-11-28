import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import * as requests from '../../../util/requests';
import { format } from 'date-fns';
import { connect } from 'react-redux';

import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Avatar, Typography, Box, Button } from '@material-ui/core';
import FriendAvatar from '../../../components/FriendAvatar';
import FriendAvatarGroup from '../../../components/FriendAvatarGroup';
import TruckCard from '../../../components/TruckCard';
import ReviewCard from '../../../components/ReviewCard';

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
        marginBottom: '20px',
        marginRight: '20px',
    },
    editButton: {
        width: 'auto',
        height: 'auto',
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
            friends: [
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
                { firstName: 'Remy', lastName: 'Sharp', avatarURL: '/static/images/avatar/1.jpg', id: 1 },
            ],
            subscribedTrucks: [],
            viewerId: undefined,
            reviews: [],
        };
        this.fetchData = this.fetchData.bind(this);
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
                });
                return requests.getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, this.props.auth);
            })
            .then(res => {
                console.log(res.data);
                if (this.state.userID == res.data.id) {
                    this.setState({
                        isMe: true,
                        viewerId: res.data.id,
                    });
                }

                return requests._get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userID}/subscriptions`);
            })
            .then(res => {
                this.setState({
                    subscribedTrucks: res.data,
                });
                return requests._get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userID}/reviews`);
            })
            .then(res => {
                this.setState({
                    reviews: res.data,
                });
            })
            .catch(err => {
                console.log(err);
                // this.props.router.push('/404');
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
                <Grid container>
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
                        {this.state.isMe && (
                            <Button
                                className={classes.editButton}
                                variant="contained"
                                color="primary"
                                href="/account/manage"
                            >
                                Edit Profile
                            </Button>
                        )}
                        <Link href={`./${this.state.userID}/friends`}>
                            <Typography variant="h4" style={{ marginTop: '20px', marginBottom: '5px' }}>
                                Friends
                            </Typography>
                        </Link>
                        <FriendAvatarGroup max={6} extraURL={`./${this.state.userID}/friends`}>
                            {this.state.friends.map((f, i) => (
                                <FriendAvatar key={i} user={f} />
                            ))}
                        </FriendAvatarGroup>
                        <Typography variant="h4" style={{ marginTop: '20px', marginBottom: '5px' }}>
                            Reviews
                        </Typography>
                        <div align={'left'}>
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
