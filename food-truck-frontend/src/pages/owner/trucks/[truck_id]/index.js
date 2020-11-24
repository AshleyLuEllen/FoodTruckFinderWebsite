import React, { Component } from 'react';
import axios from "axios";
import { withRouter } from 'next/router';
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import {CardContent, Chip, Grid, InputLabel, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import ScheduleIconRounded from "@material-ui/icons/ScheduleRounded";
import {format} from "date-fns";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ChipSelector from "../../../../components/ChipSelector";
import Box from "@material-ui/core/Box";

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: '',
            description: '',
            licensePlate: '',
            truck: '',
            owner: '',
            schedules: [],
            avg_rating: -1,
            reviews: [],
            allTags: [],
            truckTags: [],

            truckFound: false
        };
    }

    fetchData() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`).then(res => {
            this.setState({
                truck: res.data,
                owner: res.data.owner,
                id: res.data.id,
                name: res.data.name,
                description: res.data.description,
                licensePlate: res.data.licensePlate
            });
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`);
        }).then(res3 => {
            this.setState({
                schedules: res3.data
            });
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/reviews`);
        }).then(res4 => {
            this.setState({
                reviews: res4.data
            });
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/tags`);
        }).then(res5 => {
            this.setState({
                allTags: res5.data,
            });
            return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags`);
        }).then(res6 => {
            this.setState({
                truckTags: this.state.allTags.filter(t => res6.data.findIndex(tt =>
                    tt.id === t.id) !== -1),
                truckFound: true
            });
            console.log("Got all information!");
        }).catch(err => {
            console.log(err.message)
        });
    }

    /**
     * Sets the state value to the value in the form
     * @param event the source of the new value in the state
     * @param name_of_attribute
     */
    handleInputChange(event, name_of_attribute) {
        this.setState({
            [name_of_attribute]: event.target.value
        });
    }

    handleTagChange(event, tag) {
        if(tag.length < 6) {
            console.log(tag.length);
            this.setState({ truckTags: tag});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    /**
     * Saves the edited information from the form
     */
    saveInfo = () => {
        const truck = {
            id: this.props.router.query.truck_id,
            name: this.state.name,
            description: this.state.description,
            licensePlate: this.state.licensePlate,
            owner: this.state.owner
        }
        console.log(truck);

        axios.put(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`, truck)
            .then( () => {
                console.log("Truck Edited");
            }).catch((err) => {
                console.log(err.message);
            });
    }

    /**
     * Removes the truck that's currently being edited
     */
    removeTruck = () => {
        axios.delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`,
            { auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }})
            .then((res) => {
                console.log(res.statusText);
                this.props.router.push("/owner/trucks").then();
            })
            .catch((err) => {
                console.log(err.message);
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
    componentDidUpdate() {
        if(!this.state.truckFound && this.props.router.query.truck_id !== undefined) {
            this.fetchData();
        }
    }

    render() {
        return (
            <div>
                <br/>
                <br/>
                {this.state.truckFound &&
                <Grid container spacing={4} >
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            id="name"
                            label="Food Truck Name"
                            value={this.state.name}
                            fullWidth={true}
                            onChange={e => this.handleInputChange(e, "name")}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            id="licensePlate"
                            label="License Plate Number"
                            value={this.state.licensePlate}
                            fullWidth={true}
                            onChange={e => this.handleInputChange(e, "licensePlate")}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            id="description"
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth={true}
                            value={this.state.description}
                            onChange={e => this.handleInputChange(e, "description")}
                        />
                    </Grid>
                    <Grid item xs={6} >
                        <ChipSelector
                            maxCount={5}
                            label="Tags (select at most 5)"
                            options={this.state.allTags}
                            selectedOptions={this.state.truckTags}
                            onChange={(event, value) => {this.handleTagChange(event, value)}}
                            onSelectOption={t => {
                                if(this.state.truckTags.length < 5) {
                                    axios.post(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags/${t.id}`, {},
                                    {auth: { username: this.props.auth.email, password: this.props.auth.password}
                                    }).then().catch(error => {
                                        console.log(error.message);
                                    })
                                }
                            }}
                            onDeselectOption={t => axios.delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/tags/${t.id}`,
                                { auth: {
                                        username: this.props.auth.email,
                                        password: this.props.auth.password
                                    }}).then().catch(error => {
                                console.log(error.message);
                            })}
                        />
                        <Box mt={1} ml={1} mr={1} mb={1}>
                            <Button variant="contained" pt={10} pl={10} onClick={this.saveInfo}>
                                <Typography variant="button" gutterBottom display="block">
                                    Save
                                </Typography>
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box mt={1} ml={1} mr={1} mb={1}>
                            <Button variant="contained" pt={10} pl={10} href={`/owner/trucks/${this.props.router.query.truck_id}/notifications`}>
                                <Typography variant="button" gutterBottom display="block">
                                    <a>Manage Notifications</a>
                                </Typography>
                            </Button>
                        </Box>
                        <Box mt={1} ml={1} mr={1} mb={1}>
                            <Button variant="contained" pt={10} pl={10} href={`/trucks/${this.props.router.query.truck_id}`}>
                                <Typography variant="button" gutterBottom display="block">
                                    View Live Page
                                </Typography>
                            </Button>
                        </Box>
                        <Box mt={1} ml={1} mr={1} mb={1}>
                            <Button variant="contained" pt={10} pl={10} href="/owner/trucks">
                                <Typography variant="button" gutterBottom display="block">
                                    Back
                                </Typography>
                            </Button>
                        </Box>
                        <Box mt={1} ml={1} mr={1} mb={1}>
                            <Button variant="contained" pt={10} pl={10} href="/">
                                <Typography variant="button" gutterBottom display="block">
                                    Home
                                </Typography>
                            </Button>
                        </Box>
                        <br/>
                        <Box mt={1} ml={1} mr={1} mb={1}>
                            <Button width={"50%"} variant="contained" pt={10} pl={10} color="secondary" onClick={this.removeTruck}>
                                <Typography variant="button" gutterBottom display="block">
                                    Delete
                                </Typography>
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        {/**CURRENT LOCATION*/}
                        {this.state.truck.currentLocation && <div>
                            <CardHeader title={"Current Location"}/>
                            <MyLocationIcon/>  <strong>{this.state.truck.currentLocation?.location}</strong>
                        </div>}
                        {/**SCHEDULE*/}
                        {this.state.schedules.length > 0 && <Card>
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
                                <br/>
                                <Box mt={1} ml={1} mr={1} mb={1}>
                                    <Button variant="contained" href={`/owner/trucks/${this.props.router.query.truck_id}/schedule`}>
                                        <Typography variant="button" gutterBottom display="block">
                                            <a>Manage Schedule</a>
                                        </Typography>
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>}
                    </Grid>
                </Grid>}
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