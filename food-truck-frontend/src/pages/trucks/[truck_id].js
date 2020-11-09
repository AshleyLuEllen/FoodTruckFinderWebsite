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
        fontSize: '16px'
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

            reviewComment: "",
            rating: -1
        };

    }

    fetchData() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`).then(res => {
            this.setState({
                truck: res.data
            });
            console.log(this.state);
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags`);
        }).then(res2 => {
            this.setState({
                tags: res2.data,
                truckFound: true
            });
            console.log(this.state);
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`);
        }).then(res3 => {
            this.setState({
                schedules: res3.data,
                truckFound: true
            });
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/reviews`);
        }).then(res4 => {
            this.setState({
                reviews: res4.data
            });
            console.log(this.state);
            console.log("Got all information!");
        })
        .catch(err => {
            this.setState({
                truck: '',
                tags: []
            });
        });
    }

    writeReview() {
        this.setState( {
            openReview: true
        })
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
    componentWillUpdate() {
        if(!this.state.truckFound) {
            this.fetchData();
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

                {/**CURRENT LOCATION*/}
                {this.state.truckFound && this.state.truck.currentLocation && <div className={useStyles.currentLocation}>
                    <MyLocationIcon/>
                    <strong>{this.state.truck.currentLocation?.location}</strong>
                </div>}

                {/**SCHEDULE*/}
                {this.state.truckFound && this.state.schedules.length > 0 && <div>
                    {this.state.schedules.map((s, i) => (
                        <Typography key={i} variant="body1">
                            <ScheduleIconRounded/> {s.location}: {format(new Date(s.timeFrom), "MM-dd-yyyy, HH:mm")}-{format(new Date(s.timeTo), "MM-dd-yyyy, HH:mm")}
                        </Typography>
                    ))}
                </div>}
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
                            <Typography variant="subtitle 1" component="h5" className={useStyles.review} gutterBottom>
                                By: {r.user.firstName} {r.user.lastName}
                            </Typography>
                            <Rating precision={0.5} value={r.rating} size="small" readOnly/>
                            <Typography variant="subtitle 2" component="h6" >
                                {r.comment}
                            </Typography>
                            <Divider/>
                        </div>
                    ))}
                    </CardContent>
                </Card>}
                {this.state.truckFound && this.state.reviews.length === 0 &&
                <Typography variant="h8" component="h3" gutterBottom>

                </Typography>
                }

                {this.state.truckFound &&
                <Button variant="outline" onClick={this.writeReview}>
                    <Typography variant="button" gutterBottom display="block">
                        Write Review
                    </Typography>
                </Button>}

                <Dialog open={this.state.openReview} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Review for {this.state.truck.name}</DialogTitle>
                    <DialogContent>
                        <InputLabel>
                            Rating
                        </InputLabel>
                        <div align="left">
                            <Rating name="rating" precision={0.5} value={this.state.avg_rating}
                                    size="medium" onChange={this.handleInputChange}/>
                        </div>
                        <InputLabel>
                            Comment (optional)
                        </InputLabel>
                        <TextField
                            id="reviewComment"
                            label="Review Comment"
                            multiline
                            rows={4}
                            fullWidth={true}
                            defaultValue=""
                            onChange={this.handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary" variant="outlined">
                            Cancel
                        </Button>
                        {!this.state.published && <Button onClick={() => this.handleClose(false)} color="primary" variant="outlined">
                            Save
                        </Button>}
                        {!this.state.published && <Button onClick={() => this.handleClose(true)} color="primary" variant="outlined">
                            Publish
                        </Button>}
                        {!this.state.published && <Button onClick={this.handleDelete} color="primary" variant="outlined">
                            Delete
                        </Button>}
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