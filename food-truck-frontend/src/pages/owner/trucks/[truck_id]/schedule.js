import React, { Component, useEffect, useState } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import { format, parse, parseISO } from 'date-fns';

import { Container, Grid, CircularProgress, Typography, Box, TablePagination} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Delete } from '@material-ui/icons';

import TruckMap from '../../../../components/TruckMap';

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
            past: []
        };

        this.fetchData = this.fetchData.bind(this);
        this.setSchedules = this.setSchedules.bind(this);
        this.deleteScheduleById = this.deleteScheduleById.bind(this);
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

    render() {
        const {classes} = this.props;

        const columns = [
            { id: 'location', align: 'left', width: '175px', disablePadding: false, label: 'Location' },
            { id: 'timeFrom', align: 'left', width: '200px', disablePadding: false, label: 'Start Time', renderer: (val) => format(val, 'Pp') },
            { id: 'timeTo', align: 'left', width: '200px', disablePadding: false, label: 'End Time', renderer: (val) => format(val, 'Pp') },
        ];

        const rowActions = [
            { references: 'id', color: 'primary', label: 'Edit', action: (event, id) => alert(`Edit ${id}`) },
            { references: 'id', color: 'secondary', label: 'Delete', action: this.deleteScheduleById }
        ]

        const selectedActions = [
            { title: "Delete All", icon: <Delete/>, action: () => alert("delete all") },
        ]

        const unselectedActions = [
            { title: "Add", icon: <Add/>, action: () => alert("new") },
        ]

        return (
            <div>
                <Container className={classes.root}>
                    <Grid container spacing={3}>
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
                                    rowActions={rowActions}
                                    selectedActions={selectedActions}
                                    unselectedActions={unselectedActions}
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
                <DraggableDialog/>
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