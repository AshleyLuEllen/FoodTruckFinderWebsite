import React, { Component } from 'react';
import { withRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import { connect } from 'react-redux';

import Link from "next/link";
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Avatar, Typography, Box, Button } from "@material-ui/core";
import FriendAvatar from '../../../components/FriendAvatar';
import FriendAvatarGroup from '../../../components/FriendAvatarGroup';
import TruckCard from '../../../components/TruckCard';

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
        margin: "0 auto"
    },
    truckCard: {
        marginBottom: "20px"
    },
    editButton: {
        width: 'auto',
        height: 'auto'
    }
});

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined, userID: undefined, found: false, isMe: false, friends: [
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
                { firstName: "Remy", lastName: "Sharp", avatarURL: "/static/images/avatar/1.jpg", id: 1 },
            ], subscribedTrucks: [
                { name: "Test Food Truck", description: "A lighteharted eatery", id: 1 },
                { name: "Test Food Truck", description: "A lighteharted eatery", id: 1 },
                { name: "Test Food Truck", description: "A lighteharted eatery", id: 1 },
                { name: "Test Food Truck", description: "A lighteharted eatery", id: 1 },
            ]
        };
        this.fetchData = this.fetchData.bind(this);
    }

    formatDate(dateStr) {
        if (!dateStr) {
            return undefined;
        }
        return format(new Date(dateStr), "MMMM d, yyyy");
    }

    fetchData() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userID}`)
            .then(res => {
                this.setState({
                    user: res.data,
                    found: true
                });
                axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
                    auth: {
                        username: this.props.auth.email,
                        password: this.props.auth.password
                    }
                })
                    .then(res => {
                        console.log(res.data);
                        if (this.state.userID == res.data.id) {
                            this.setState({
                                isMe: true
                            });
                        }
                    })
                    .catch(err => {})
            })
            .catch(err => {
                console.log(err);
                // this.props.router.push('/404');
            })
    }

    componentDidMount() {
        this.setState({
            userID: this.props.router.query.user_id
        });
    }

    componentDidUpdate() {
        if (!this.state.found) {
            if (this.state.userID === undefined) {
                if (this.props.router.query.user_id !== undefined) {
                    this.setState({
                        userID: this.props.router.query.user_id
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
            <Container style={{ marginTop: "20px", textAlign: "center" }}>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Avatar className={classes.bigAvatar} alt={`${this.state.user?.firstName} ${this.state.user?.lastName}`} src={this.state.user?.avatarURL} />
                        <Typography variant="h3" style={{ marginTop: "10px" }}>{this.state.user?.firstName} {this.state.user?.lastName}</Typography>
                        <Typography variant="subtitle2" style={{ fontStyle: "italic" }}>Member since {this.formatDate(this.state.user?.sinceTime)}</Typography>
                        <Typography variant="subtitle1" style={{ marginTop: "10px" }}>{this.state.user?.description || <em>This user has not set a bio.</em>}</Typography>
                        {this.state.isMe && <Button className={classes.editButton} variant="contained" color="primary" href="/account/manage">Edit Profile</Button>}
                        <Typography variant="h4" style={{ marginTop: "20px", marginBottom: "5px" }}>Friends</Typography>
                        <FriendAvatarGroup max={6} extraURL={`./${this.state.userID}/friends`}>
                            {this.state.friends.map(f => (
                                <FriendAvatar user={f} />
                            ))}
                        </FriendAvatarGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" style={{ marginTop: "20px", marginBottom: "5px" }}>{this.state.user?.firstName}'s Subscriptions</Typography>
                        <Box style={{ textAlign: "left", maxHeight: 700, overflow: "auto" }}>
                            {this.state.subscribedTrucks.map(t => (
                                // Todo: dynamically fetch infos 
                                <TruckCard className={classes.truckCard} truck={t} subscribed={true} tags={["$$", "Cajun", "Comfort Food", "Lighthearted", "Fast"]} image="https://miro.medium.com/max/8064/1*5_J_YlYTmwRvigEr3JKCZg.jpeg" />
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
    
}
  
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withRouter(UserPage)));