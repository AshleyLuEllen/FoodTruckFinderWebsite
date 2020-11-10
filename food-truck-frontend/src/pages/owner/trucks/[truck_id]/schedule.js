import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import { format, parse } from 'date-fns';

import { Container, Grid, CircularProgress } from '@material-ui/core';

import TruckMap from '../../../../components/TruckMap';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';


import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function DraggableDialog(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open form dialog
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Subscribe
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const scheduleStyles = theme => ({
    root: {
        marginTop: '20px'
    },
    mapWrapper: {
        position: 'relative',
        width: '100%',
        height: '87vh'
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '87vh'
    },
    progress: {
        margin: '0 auto'
    }
});

class ScheduleManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedules: [],
            location: '',
            time_from: '',
            time_to: '',
            truckFound: false,
            editing: false,
            editingSchedule: undefined,
            loading: true,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateTruckSchedule = this.updateTruckSchedule.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.editSchedule = this.editSchedule.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    fetchData() {
        if (this.props.router.query?.truck_id === undefined) {
            return;
        }

        axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`).then(res => {
            this.setState({
                schedules: res.data
            });
        }).catch(err => {
            console.log(err);
        });
    }

    clearForm() {
        this.setState({
            location: '',
            time_from: '',
            time_to: '',
            editing: false,
            editingSchedule: undefined
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.router?.query?.truck_id != prevProps.router?.query?.truck_id && !this.state.truckFound) {
            this.fetchData();
        }
    }

    editSchedule(i) {
        this.setState({
            editing: true,
            editingSchedule: this.state.schedules[i],
            location: this.state.schedules[i].location,
            time_from: format(new Date(this.state.schedules[i].timeFrom), "yyyy-MM-dd'T'HH:mm"),
            time_to: format(new Date(this.state.schedules[i].timeTo), "yyyy-MM-dd'T'HH:mm")
        });
    }

    deleteSchedule(i) {
        axios.delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules/${this.state.schedules[i].id}`, {
            auth: {
                username: this.props.auth.email,
                password: this.props.auth.password
            }
        })
        .then((res) => {
            this.clearForm();
            this.fetchData();
        })
        .catch((err) => {
            alert(err);
            // alert("Invalid Schedule/Location")
            console.log(err);
        });
    }

    updateTruckSchedule() {
        if (!(this.state.location && this.state.time_from && this.state.time_to && this.state.location !== '' && this.state.time_from !== '' && this.state.time_to !== '')) {
            return;
        }

        const schedule = {
            location: this.state.location,
            timeFrom: parse(this.state.time_from, "yyyy-MM-dd'T'HH:mm", new Date()).toISOString(),
            timeTo: parse(this.state.time_to, "yyyy-MM-dd'T'HH:mm", new Date()).toISOString(),
        }

        // Check if editing
        if (this.state.editing) {
            schedule.id = this.state.editingSchedule.id;
            schedule.truck = this.state.editingSchedule.truck;

            // Update
            axios.put(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules/${schedule.id}`, schedule, {
                auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }
            })
            .then((res) => {
                this.clearForm();
                this.fetchData();
            })
            .catch((err) => {
                alert(err);
                // alert("Invalid Schedule/Location")
                console.log(err);
            });
        } else {
            // Create new
            axios.post(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`, schedule,{
                auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }
            })
            .then((res) => {
                this.clearForm();
                this.fetchData();
            })
            .catch((err) => {
                alert(err);
                // alert("Invalid Schedule/Location")
                console.log(err);
            });
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <Container className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                    {!this.state.loading &&
                        <Grid item xs={12} md={4}>
                            <Box style={{ textAlign: "left", maxHeight: "calc(87vh)", overflow: "auto" }}>
                                {this.state.recommendations.length > 0 && <Fragment>
                                    <Typography variant="h4" style={{ marginBottom: "10px", textAlign: "center" }}>{this.state.user?.firstName}Recommendations</Typography>
                                    {this.state.recommendations.map((tr, i) => (
                                        <TruckCard key={i} className={classes.truckCard} truck={tr} tags={tr.tags.map(tag => tag.tag.name)} onClick={evt => this.setState({currentlySelected: i})}/>
                                    ))}
                                    <Divider style={{ marginTop: "10px", marginBottom: "10px" }}/>
                                </Fragment>}
                                <Typography variant="h4" style={{ marginBottom: "10px", textAlign: "center" }}>{this.state.user?.firstName}Your Subscriptions</Typography>
                                {this.state.subscriptions.map((tr, i) => (
                                    <TruckCard key={100 + i} className={classes.truckCard} truck={tr} tags={tr.tags.map(tag => tag.tag.name)} onClick={evt => this.setState({currentlySelected: this.state.recommendations.length + i})}/>
                                ))}
                            </Box>
                        </Grid>
                    }
                    {this.state.loading &&
                        <Grid item xs={12} md={4}>
                            <div className={classes.progressContainer}>
                                <CircularProgress className={classes.progress} size="3.5rem"/>
                            </div>
                        </Grid>
                    }
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className={classes.mapWrapper}>
                            <TruckMap trucks={[]} selected={0}/>
                        </div>
                    </Grid>
                </Grid>
            </Container>
            // <div className="truck-schedule-form">
            //     <h2>Schedule</h2>
            //     <table>
            //         <thead>
            //             <tr>
            //                 <th>Location</th>
            //                 <th>Time From</th>
            //                 <th>Time To</th>
            //                 <th></th>
            //                 <th></th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {this.state.schedules.map((s, i) => (
            //                 <tr key={i}>
            //                     <td>{s.location}</td>
            //                     <td>{s.timeFrom}</td>
            //                     <td>{s.timeTo}</td>
            //                     <td><button onClick={() => this.editSchedule(i)}>Edit</button></td>
            //                     <td><button onClick={() => this.deleteSchedule(i)}>Delete</button></td>
            //                 </tr>
            //             ))}
            //         </tbody>
            //     </table>

            //     <form onSubmit={this.handleSubmit} method="put">
            //         <table className="schedule-details">
            //             <tbody>
            //             <tr>
            //                 <td>
            //                     <label for="locationSun">
            //                         Location:
            //                     </label>
            //                 </td>
            //                 <td>
            //                     <input name="location" location="location" type="text"
            //                            value={this.state.location} onChange={this.handleInputChange} />
            //                 </td>
            //             </tr>
            //             <tr>
            //                 <td>
            //                     <label for="timeFromSun">
            //                         From:
            //                     </label>
            //                 </td>
            //                 <td>
            //                     <input name="time_from" time_from="time_from" type="datetime-local"
            //                            value={this.state.time_from} onChange={this.handleInputChange} />

            //                 </td>
            //             </tr>
            //             <tr>
            //                 <td>
            //                     <label for="timeToSun">
            //                         To:
            //                     </label>
            //                 </td>
            //                 <td>
            //                     <input name="time_to" time_to="time_to" type="datetime-local"
            //                            value={this.state.time_to} onChange={this.handleInputChange} />
            //                 </td>
            //             </tr>
            //             </tbody>
            //         </table>
            //         <button className="schedule-submit-button" onClick={this.updateTruckSchedule}>
            //             {this.state.editing ? "Save changes" : "Create New"}
            //         </button>
            //     </form>
            //     <br />
            //     <label>{this.state.message}</label>
            //     <li>
            //         <Link href={`/owner/trucks/${this.props?.router?.query?.truck_id}`}>
            //             <a>Cancel</a>
            //         </Link>
            //     </li>
            // </div>
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}

const mapDispatchToProps = {
}

export default withStyles(scheduleStyles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleManagementPage)));