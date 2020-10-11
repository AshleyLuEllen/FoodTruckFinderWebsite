import React, { Component } from 'react';
import { withRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';

import Link from "next/link";
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Avatar, Typography, Card, CardHeader, Box, IconButton, CardActions, CardMedia, CardContent, Chip, Paper } from "@material-ui/core";
import { AvatarGroup } from '@material-ui/lab';
import { Add, Notifications, NotificationsOff } from '@material-ui/icons';

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
    friendAvatars: {
        justifyContent: "center",
        '& > *:hover': {
            cursor: "pointer"
        }
    },
    media: {
        height: 0,
        // paddingTop: '56.25%', // 16:9
        paddingTop: '30%',
        margin: "0 20px"
    },
    truckCard: {
        marginBottom: "20px"
    },
    truckTags: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(0.5),
        },
    }
});

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, userID: undefined, found: false };
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

    componentDidUpdate(){
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
            <Container style={{marginTop: "20px", textAlign: "center"}}>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Avatar className={classes.bigAvatar} alt={`${this.state.user?.firstName} ${this.state.user?.lastName}`} src={this.state.user?.avatarURL}/>
                        <Typography variant="h3" style={{marginTop: "10px"}}>{this.state.user?.firstName} {this.state.user?.lastName}</Typography>
                        <Typography variant="subtitle2" style={{fontStyle: "italic"}}>Member since {this.formatDate(this.state.user?.sinceTime)}</Typography>
                        <Typography variant="subtitle1" style={{marginTop: "10px"}}>{this.state.user?.description || <em>This user has not set a bio.</em>}</Typography>
                        <Typography variant="h4" style={{marginTop: "20px", marginBottom: "5px"}}>Friends</Typography>
                        <AvatarGroup max={6} spacing="0" className={classes.friendAvatars}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" onClick={e => alert("test")}/>
                            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                        </AvatarGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" style={{marginTop: "20px", marginBottom: "5px"}}>Matthew's Subscriptions</Typography> 
                        <Box style={{textAlign: "left", maxHeight: 700, overflow: "auto"}}>
                            <Card className={classes.truckCard}>
                                <CardHeader 
                                    title={<Link href="https://google.com">Test Food Truck</Link>}
                                    subheader="A cool new comfort food truck"
                                    action={
                                        <IconButton aria-label="settings">
                                          <Notifications />
                                        </IconButton>
                                    }
                                />
                                <CardMedia
                                    className={classes.media}
                                    image="https://miro.medium.com/max/8064/1*5_J_YlYTmwRvigEr3JKCZg.jpeg"
                                    title="Test Food Truck"
                                />
                                <CardContent>
                                    <div className={classes.truckTags}>
                                        <Chip label="$$" href="#" />
                                        <Chip label="Cajun" />
                                        <Chip label="Comfort Food" />
                                        <Chip label="Lighthearted" />
                                        <Chip label="Fast" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className={classes.truckCard}>
                                <CardHeader 
                                    title={<Link href="https://google.com">Test Food Truck</Link>}
                                    subheader="A cool new comfort food truck"
                                    action={
                                        <IconButton aria-label="settings">
                                          <NotificationsOff />
                                        </IconButton>
                                    }
                                />
                                <CardMedia
                                    className={classes.media}
                                    image="https://miro.medium.com/max/8064/1*5_J_YlYTmwRvigEr3JKCZg.jpeg"
                                    title="Test Food Truck"
                                />
                                <CardContent>
                                    <div className={classes.truckTags}>
                                        <Chip label="$$" href="#" />
                                        <Chip label="Cajun" />
                                        <Chip label="Comfort Food" />
                                        <Chip label="Lighthearted" />
                                        <Chip label="Fast" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className={classes.truckCard}>
                                <CardHeader 
                                    title={<Link href="https://google.com">Test Food Truck</Link>}
                                    subheader="A cool new comfort food truck"
                                    action={
                                        <IconButton aria-label="settings">
                                          <NotificationsOff />
                                        </IconButton>
                                    }
                                />
                                <CardMedia
                                    className={classes.media}
                                    image="https://miro.medium.com/max/8064/1*5_J_YlYTmwRvigEr3JKCZg.jpeg"
                                    title="Test Food Truck"
                                />
                                <CardContent>
                                    <div className={classes.truckTags}>
                                        <Chip label="$$" href="#" />
                                        <Chip label="Cajun" />
                                        <Chip label="Comfort Food" />
                                        <Chip label="Lighthearted" />
                                        <Chip label="Fast" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(UserPage));