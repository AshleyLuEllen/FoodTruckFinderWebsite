import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from 'next/router';
import { connect } from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {CardContent, Chip, InputLabel, TextField} from "@material-ui/core";
import {Rating} from "@material-ui/lab";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import ScheduleIconRounded from "@material-ui/icons/ScheduleRounded";
import {format} from "date-fns";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

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
class Information extends Component {
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

    render() {
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

                {/**BUTTONS*/}
                <br/>
                {this.state.truckFound &&
                    <div>
                        <Button variant="outlined" href={`/owner/trucks/${this.props.router.query.truck_id}/manage`}>
                            <Typography variant="button" gutterBottom display="block">
                                <a>Manage Truck</a>
                            </Typography>
                        </Button>
                        <Button variant="outlined" href={`/owner/trucks/${this.props.router.query.truck_id}/notifications`}>
                            <Typography variant="button" gutterBottom display="block">
                                <a>Notifications</a>
                            </Typography>
                        </Button>
                        <Button variant="outlined" href={`/owner/trucks/${this.props.router.query.truck_id}/schedule`}>
                            <Typography variant="button" gutterBottom display="block">
                                <a>Truck Schedule</a>
                            </Typography>
                        </Button>
                        <Button variant="outlined" href={`/trucks/${this.props.router.query.truck_id}`}>
                            <Typography variant="button" gutterBottom display="block">
                                View Live Page
                            </Typography>
                        </Button>
                    </div>
                }
                <Button variant="outlined" href="/owner/trucks">
                    <Typography variant="button" gutterBottom display="block">
                        Back
                    </Typography>
                </Button>
                <Button variant="outlined" href="/">
                    <Typography variant="button" gutterBottom display="block">
                        Home
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Information));