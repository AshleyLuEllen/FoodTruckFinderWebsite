import React, { Component, useEffect, useState } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import { format, parse, parseISO } from 'date-fns';

import { Container, Grid, CircularProgress, Typography, Box, TablePagination} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Delete } from '@material-ui/icons';

import { DateTimePicker } from "@material-ui/pickers";


import TruckMap from '../../../../components/TruckMap';
import LocationInput from '../../../../components/LocationInput';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import EnhancedTable from '../../../../components/tables/EnhancedTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
    dateTimeInput : {
        width: '100%',
        "& > button": {
            width: 'auto',
            height: 'auto'
        }
    }
}));

function DraggableDialog(props) {
    const classes = useStyles();

    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const [locationStr, setLocationStr] = useState('');
    const [locationChanged, setLocationChanged] = useState(false);
    const [placeId, setPlaceId] = useState(undefined);

    useEffect(() => {
        if (props.open === true) {
            setStartDate(props.initialData?.timeFrom || new Date());
            setEndDate(props.initialData?.timeTo || new Date());
            setLocationStr(props.initialData?.location || "");
            setLocationChanged(!props.editing);
            setPlaceId(undefined)
        }
    }, [props.open]);

    const handleClose = () => {
        props.onClose && props.onClose();
    };

    const handleSave = () => {
        if (locationChanged && !placeId) {
            return;
        }

        props.onSave && props.onSave({
            placeId,
            timeFrom: startDate,
            timeTo: endDate
        });
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {props.editing ? "Edit" : "Create"} Schedule
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.editing ? "Edit" : "Specify"} the start and end dates/times here, as well as the location where your truck will be during this interval of time. All of these individual "schedules" will consist your truck's hours.
                    </DialogContentText>
                    <LocationInput
                        initialValue={locationStr}
                        onChange={(event, newValue) => {
                            setPlaceId(newValue?.place_id);
                            setLocationChanged(true);
                        }}
                        required
                    />
                    <br/>
                    <DateTimePicker
                        className={classes.dateTimeInput}
                        value={startDate}
                        inputVariant="outlined"
                        onChange={setStartDate}
                        label="Start Date/Time"
                        showTodayButton
                        required
                    />
                    <br/>
                    <br/>
                    <DateTimePicker
                        className={classes.dateTimeInput}
                        value={endDate}
                        inputVariant="outlined"
                        onChange={setEndDate}
                        label="End Date/Time"
                        showTodayButton
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {props.editing ? "Save Changes" : "Create New Schedule"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const scheduleStyles = theme => ({
    root: {
        marginTop: '20px',
        maxWidth: '95%'
    },
    mapWrapper: {
        position: 'relative',
        width: '100%',
        height: '50vh'
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        height: 'calc(87vh - 51px)'
    },
    progress: {
        margin: '0 auto'
    }
});

class ScheduleManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            upcoming: [],
            past: [],
            editorOpen: false,
            editing: false,
            initialData: undefined
        };

        this.fetchData = this.fetchData.bind(this);
        this.setSchedules = this.setSchedules.bind(this);
        this.deleteScheduleById = this.deleteScheduleById.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.triggerEdit = this.triggerEdit.bind(this);
        this.triggerCreation = this.triggerCreation.bind(this);
    }

    fetchData() {
        if (this.props.router.query?.truck_id === undefined) {
            return;
        }

        axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`).then(res => {
            const schedules = res.data.map(schedule => ({
                id: schedule.id,
                scheduleId: schedule.id,
                latitude: schedule.latitude,
                longitude: schedule.longitude,
                location: schedule.location,
                timeFrom: parseISO(schedule.timeFrom),
                timeTo: parseISO(schedule.timeTo),
            }));
            this.setSchedules(schedules);
        }).catch(err => {
            console.log(err);
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

    setSchedules(schedules) {
        const sl = [...schedules];
        this.setState({
            upcoming: sl.filter(s => s.timeFrom > Date.now()).map(s => Object.assign({}, s)),
            past: sl.filter(s => s.timeFrom <= Date.now()).map(s => Object.assign({}, s)),
            loading: false
        }, () => console.log(this.state.past));
    }

    deleteScheduleById(event, id) {
        this.setSchedules([...this.state.upcoming, ...this.state.past].filter(s => s.id != id));
    }

    triggerCreation() {
        this.setState({
            open: true,
            editing: false,
            initialData: undefined
        });
    }

    triggerEdit(event, id) {
        this.setState({
            open: true,
            editing: true,
            initialData: this.state.upcoming.find(s => s.id == id)
        });
    }

    handleSave(savedData) {
        this.setState({
            open: false
        });
        console.log(savedData);
    }

    render() {
        const {classes} = this.props;

        const columns = [
            { id: 'location', align: 'left', width: '175px', disablePadding: false, label: 'Location' },
            { id: 'timeFrom', align: 'left', width: '225px', disablePadding: false, label: 'Start Time', renderer: (val) => format(val, 'Pp') },
            { id: 'timeTo', align: 'left', width: '225px', disablePadding: false, label: 'End Time', renderer: (val) => format(val, 'Pp') },
        ];

        const rowActions = [
            { references: 'id', color: 'primary', label: 'Edit', action: this.triggerEdit },
            { references: 'id', color: 'secondary', label: 'Delete', action: this.deleteScheduleById }
        ]

        const selectedActions = [
            { title: "Delete All", icon: <Delete/>, action: () => alert("delete all") },
        ]

        const unselectedActions = [
            { title: "Add", icon: <Add/>, action: this.triggerCreation },
        ]

        return (
            <div>
                <Container className={classes.root}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} md={6}>
                            <Box style={{ textAlign: "left", overflow: "auto" }}>
                                <EnhancedTable
                                    columns={columns}
                                    rowActions={rowActions}
                                    selectedActions={selectedActions}
                                    unselectedActions={unselectedActions}
                                    title="Upcoming Schedules"
                                    rows={this.state.upcoming}
                                    order="asc"
                                    orderBy="timeFrom"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box style={{ textAlign: "left", overflow: "auto" }}>
                            <EnhancedTable
                                    columns={columns}
                                    rowActions={rowActions.slice(1)}
                                    selectedActions={selectedActions}
                                    title="Past Schedules"
                                    rows={this.state.past}
                                    order="desc"
                                    orderBy="timeFrom"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <div className={classes.mapWrapper}>
                                <TruckMap trucks={[]} selected={0}/>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
                <DraggableDialog
                    open={this.state.open}
                    editing={this.state.editing}
                    initialData={this.state.initialData}
                    onClose={() => this.setState({ open: false })}
                    onSave={this.handleSave}
                />
            </div>
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