import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from 'next/router';
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import {CardContent, Chip, InputLabel, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MyLocationIcon from '@material-ui/icons/MyLocation';
import ScheduleIconRounded from '@material-ui/icons/ScheduleRounded';
import {format} from "date-fns";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {Rating} from "@material-ui/lab";
import Divider from "@material-ui/core/Divider";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";

const useStyles = makeStyles((theme) => ({
    text: {
        padding: '30px',
        marginLeft: theme.spacing(2),
        margin: theme.spacing(1)
    },
    truckTags: {
        display: 'flex',
        alignContent: 'center',
        flexWrap: 'wrap',
        paddingTop: '20px',
        paddingLeft: '30px'
    },
    currentLocation: {
        fontSize: '20px'
    },
    ratingContainer: {
        display: "flex",
        height: "50px",
        alignItems: "center",
        justifyContent: "center"
    },
    review: {
        fontSize: '14 px',
        marginBottom: 10,
        margin: theme.spacing(1)
    }
}));

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
            truckFound: false,
            openReview: false,
            subscribed: false,
            userId: false,

            reviewComment: "",
            rating: -1
        };

        this.toggleSubscribe = this.toggleSubscribe.bind(this);
        this.writeReview = this.writeReview.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.createReview = this.createReview.bind(this);
    }

    fetchData() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`).then(res => {
            this.setState({
                truck: res.data
            });
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags`);
        }).then(res2 => {
            this.setState({
                tags: res2.data
            });
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`);
        }).then(res3 => {
            this.setState({
                schedules: res3.data
            });
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/reviews`);
        }).then(res4 => {
            this.setState({
                reviews: res4.data,
                truckFound: true
            });
            console.log("Got all information!");
        })
        .catch(err => {
            this.setState({
                truck: '',
                tags: []
            });
        });

        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
            auth: {
                username: this.props.auth.email,
                password: this.props.auth.password
            }
        })
        .then(res => {
            this.setState({
                userId: res.data.id
            });
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${res.data.id}/subscriptions/${this.props.router.query.truck_id}`)
            .then(res => {
                this.setState({
                    subscribed: true
                });
            })
            .catch(err => {
                this.setState({
                    subscribed: false
                });
            })
        })
        .catch(err => {
            this.setState({
                userId: undefined
            });
        });
    }

    writeReview() {
        this.setState( {
            openReview: true
        })
    }

    handleCancel() {
        this.setState( {
            openReview: false,
            rating: 0,
            comment: ""
        })
    }

    createReview() {
        const review = {
            comment: this.state.reviewComment,
            rating: this.state.rating
        }
        console.log(this.state.reviewComment);
        console.log(review.comment);
        axios.post(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/reviews`, review,
            { auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }}).then (res => {
                console.log("created review!");
        }).catch(err => console.log(err.message));

        this.setState({
            openReview: false,
            truckFound: false,
            rating: 0,
            comment: ""
        });
    }

    handleInputChange(e, value) {
        if(value == null) {
            this.setState( {
                reviewComment: e.target.value
            });
        }
        else {
            this.setState({
                rating: value
            });
        }
    }

    /**
     * Displays all the information about the truck who's id is being
     * used in the URL
     */
    componentDidMount() {

    }

    /**
     * Continuously updates the truck information on the page
     */
    componentDidUpdate() {
        if(!this.state.truckFound && this.props.router.query.truck_id !== undefined) {
            this.fetchData();
        }
    }

    toggleSubscribe() {
        if (!this.props.auth.isLoggedIn) {
            alert("To subscribe to a food truck, you need to be logged in. Click the log-in button in the top right to log in or create an account.");
        } else {
            if (!this.state.subscribed) {
                axios.post(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/subscriptions/${this.state.truck.id}`, {}, {
                    auth: {
                        username: this.props.auth.email,
                        password: this.props.auth.password
                    }
                })
                .then(res => {
                    this.setState({
                        subscribed: true
                    });
                })
                .catch(err => console.log(err));
            } else {
                axios.delete(`${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/subscriptions/${this.state.truck.id}`, {
                    auth: {
                        username: this.props.auth.email,
                        password: this.props.auth.password
                    }
                })
                .then(res => {
                    this.setState({
                        subscribed: false
                    });
                })
                .catch(err => console.log(err));
            }
        }
    }

    render() {
        /**
         * display the information
         */
        return (
            <div>
                {/**TRUCK NAME*/}
                {this.state.truckFound &&
                <Typography variant="h2" align="center">
                            {this.state.truck.name}
                </Typography>}

                {/**TAGS*/}
                {this.state.truckFound && this.state.tags.length > 0 && <div align="center" className={useStyles.truckTags}>
                    {this.state.tags.map((t, i) => (
                        <Chip key={i} label={t.name}/>
                    ))}
                </div>}

                {/**RATING*/}
                {this.state.truckFound && this.state.truck.rating !== null &&
                <div align="center">
                    <Rating name="rating" precision={0.5} value={this.state.truck.rating} size="medium" readOnly />
                </div>}

                {/**SUBSCRIBE BUTTON*/}
                {this.state.userId &&
                <div align="center">
                    <Button color={this.state.subscribed ? "secondary" : "primary"} variant="contained" onClick={this.toggleSubscribe}>{this.state.subscribed ? "Unsubscribe" : "Subscribe"}</Button>
                </div>}

                {/**DESCRIPTION*/}
                {this.state.truckFound &&
                    <div>
                        <CardHeader title="Description"/>
                        <CardContent>
                            <Typography variant="body1" component="p" gutterbottom className={useStyles.text}>
                                {this.state.truck.description}
                            </Typography>
                        </CardContent>
                    </div>}
                <Divider variant="inset"/>

                {/**LICENSE*/}
                {this.state.truckFound &&
                <div>
                    <CardHeader title={"License Plate"}/>
                    <CardContent>
                        <Typography variant="body1" component="p" gutterbottom className={useStyles.text}>
                            {this.state.truck.licensePlate}
                        </Typography>
                    </CardContent>
                </div>}
                <Divider variant="inset"/>

                {/**OWNER*/}
                {this.state.truckFound &&
                <div>
                    <CardHeader title={"Owner"}/>
                    <CardContent>
                        <Typography variant="body1" component="p" gutterbottom className={useStyles.text}>
                            {this.state.truck.owner.firstName} {this.state.truck.owner.lastName}
                        </Typography>
                    </CardContent>
                </div>}
                <Divider variant="inset"/>

                <br/>
                {/**CURRENT LOCATION*/}
                {this.state.truckFound && this.state.truck.currentLocation && <div className={useStyles.currentLocation}>
                    <CardHeader title={"Current Location"}/>
                    <MyLocationIcon/>  <strong>{this.state.truck.currentLocation?.location}</strong>
                </div>}

                <br/>
                {/**SCHEDULE*/}
                {this.state.truckFound && this.state.schedules.length > 0 && <Card>
                    <CardHeader title={"Schedule"}/>
                    <CardContent>
                        <Table size="small">
                            <TableBody>
                                {this.state.schedules.map((s, i) => (
                                    <TableRow>
                                        <TableCell>
                                            <Typography key={i} variant="body1">
                                                <ScheduleIconRounded/> {s.location}: {format(new Date(s.timeFrom), "MM/dd/yyyy HH:mm")} to {format(new Date(s.timeTo), "MM/dd/yyyy HH:mm")}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>}
                <br/>

                {/**REVIEWS*/}
                <Divider/>
                {this.state.truckFound && this.state.reviews.length > 0 &&
                <Card>
                    <CardHeader title="Reviews"/>
                    <CardContent>
                    {this.state.reviews.map((r, i) => (
                        <div>
                            <Typography variant="h8" component="h3" gutterBottom>
                                {format(new Date(r.reviewTimestamp), "MM-dd-yyyy, HH:mm")}
                            </Typography>
                            <Link href={`/user/${r.user.id}`}>
                                <Typography variant="subtitle 1" component="h5" className={useStyles.review} gutterBottom>
                                    By: {r.user.firstName} {r.user.lastName}
                                </Typography>
                            </Link>

                            <Rating precision={0.5} value={r.rating} size="small" readOnly/>
                            <Typography variant="subtitle 2" component="h4" >
                                {r.comment}
                            </Typography>
                            <Divider/>
                        </div>
                    ))}
                    </CardContent>
                </Card>}

                {this.state.truckFound && this.state.reviews.length === 0 &&
                <Card>
                    <CardHeader title={"Reviews"}/>
                    <CardContent>
                        <Typography variant="body1" component="p" gutterbottom className={useStyles.text}>
                            No reviews for <strong>{this.state.truck.name}</strong>
                        </Typography>
                    </CardContent>
                </Card>
                }

                {this.state.truckFound &&
                <Button variant={"outline"} onClick={this.writeReview}>
                    <Typography variant="button" gutterBottom display="block" color={"primary"}>
                        Write Review
                    </Typography>
                </Button>}

                <Dialog open={this.state.openReview} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Review for {this.state.truck.name}</DialogTitle>
                    <DialogContent>
                        <InputLabel>
                            Rating
                        </InputLabel>
                        <div className={useStyles.ratingContainer}>
                            <Rating
                                name="preferredRating" precision={0.5} value={this.state.rating}
                                onChange={(event, newValue) => {
                                    this.handleInputChange(event, newValue);
                                }}
                                size="medium"
                            />
                        </div>
                        <TextField id="reviewComment" label="Review Comment (optional)"
                            multiline rows={4} fullWidth={true} defaultValue=""
                            onChange={e => this.handleInputChange(e, null)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary" variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={this.createReview} color="primary" variant="outlined">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/**BACK*/}
                <br/>
                <Button variant="outlined" href="/">
                    <Typography variant="button" gutterBottom display="block">
                        Back
                    </Typography>
                </Button>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { auth } = state
    return { auth }
};

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TruckPage));