import React, { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import requests from '../../../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { format, parseISO } from 'date-fns';

import {
    Container,
    Grid,
    Typography,
    Box,
    Breadcrumbs,
    Link as MuiLink,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogContentText,
    DialogTitle,
    Paper,
    CircularProgress,
    Snackbar,
} from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { DateTimePicker } from '@material-ui/pickers';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Draggable from 'react-draggable';
import EnhancedTable from '../../../../components/tables/EnhancedTable';
import LocationInput from '../../../../components/LocationInput';
import Head from 'next/dist/next-server/lib/head';

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const useStyles = makeStyles(() => ({
    dateTimeInput: {
        width: '100%',
        '& > button': {
            width: 'auto',
            height: 'auto',
        },
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function DraggableDialog(props) {
    const classes = useStyles();

    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const [locationStr, setLocationStr] = useState('');
    const [locationChanged, setLocationChanged] = useState(false);
    const [placeId, setPlaceId] = useState(undefined);
    const [resultLocationStr, setResultLocationStr] = useState('');

    useEffect(() => {
        if (props.open === true) {
            setStartDate(props.initialData?.timeFrom || new Date());
            setEndDate(props.initialData?.timeTo || new Date());
            setLocationStr(props.initialData?.location || '');
            setResultLocationStr(props.initialData?.location || '');
            setLocationChanged(!props.editing);
            setPlaceId(undefined);
        }
    }, [props.open]);

    const handleClose = () => {
        props.onClose && props.onClose();
    };

    const handleSave = () => {
        if (locationChanged && !placeId) {
            return;
        }

        props.onSave &&
            props.onSave({
                placeId,
                timeFrom: startDate,
                timeTo: endDate,
                id: props?.initialData?.id,
                location: resultLocationStr,
            });
    };

    return (
        <div>
            <Dialog
                open={props.open || false}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {props.editing ? 'Edit' : 'Create'} Schedule
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.editing ? 'Edit' : 'Specify'} the start and end dates/times here, as well as the location
                        where your truck will be during this interval of time. All of these individual
                        &quot;schedules&quot; will consist your truck&apos;s hours.
                    </DialogContentText>
                    <LocationInput
                        initialValue={locationStr}
                        onChange={(event, newValue) => {
                            setPlaceId(newValue?.place_id);
                            setLocationChanged(true);
                            setResultLocationStr(newValue?.structured_formatting?.main_text || newValue?.description);
                        }}
                        required
                    />
                    <br />
                    <DateTimePicker
                        className={classes.dateTimeInput}
                        value={startDate}
                        inputVariant="outlined"
                        onChange={setStartDate}
                        label="Start Date/Time"
                        showTodayButton
                        required
                    />
                    <br />
                    <br />
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
                    <Button
                        autoFocus
                        onClick={handleClose}
                        color="secondary"
                        variant="contained"
                        disabled={props.updating}
                    >
                        Cancel
                    </Button>
                    <div style={{ position: 'relative' }}>
                        <Button onClick={handleSave} color="primary" variant="contained" disabled={props.updating}>
                            {props.editing ? 'Save Changes' : 'Create New Schedule'}
                        </Button>
                        {props.updating && <CircularProgress className={classes.buttonProgress} size={24} />}
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

DraggableDialog.propTypes = {
    open: PropTypes.bool,
    initialData: PropTypes.shape({
        timeFrom: PropTypes.instanceOf(Date),
        timeTo: PropTypes.instanceOf(Date),
        location: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    editing: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    updating: PropTypes.bool,
};

const scheduleStyles = () => ({
    root: {
        marginTop: '20px',
        maxWidth: '95%',
    },
    mapWrapper: {
        position: 'relative',
        width: '100%',
        height: '50vh',
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        height: 'calc(87vh - 51px)',
    },
    progress: { position: 'absolute', top: '50%', left: '50%', marginTop: -32, marginLeft: -32 },
    breadcrumb: {
        textDecoration: 'none',
    },
});

class ScheduleManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            upcoming: [],
            past: [],
            open: false,
            editing: false,
            initialData: undefined,
            upcomingSelected: [],
            pastSelected: [],
            errorOpen: false,
            updating: false,
            errorMsg: '',
            errorSeverity: 'error',
        };

        this.fetchData = this.fetchData.bind(this);
        this.setSchedules = this.setSchedules.bind(this);
        this.deleteScheduleById = this.deleteScheduleById.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.triggerEdit = this.triggerEdit.bind(this);
        this.triggerCreation = this.triggerCreation.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
    }

    fetchData() {
        if (this.props.router.query?.truck_id === undefined) {
            return;
        }

        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`)
            .then(res => {
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
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg: 'Error: could not fetch schedule data! Check the console for more information.',
                    errorOpen: true,
                    loading: false,
                });
            });
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.router?.query?.truck_id !== prevProps.router?.query?.truck_id && !this.state.truckFound) {
            this.fetchData();
        }
    }

    setSchedules(schedules) {
        const sl = [...schedules];
        this.setState({
            upcoming: sl.filter(s => s.timeTo > Date.now()).map(s => Object.assign({}, s)),
            past: sl.filter(s => s.timeTo <= Date.now()).map(s => Object.assign({}, s)),
            loading: false,
        });
    }

    deleteScheduleById(_event, id) {
        requests
            .deleteWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules/${id}`,
                this.props.auth
            )
            .then(() => {
                this.setSchedules([...this.state.upcoming, ...this.state.past].filter(s => s.id !== id));
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg: 'Error: could not delete schedule! Check the console for more information.',
                    errorOpen: true,
                    loading: false,
                });
            });
    }

    triggerCreation() {
        this.setState({
            open: true,
            editing: false,
            initialData: undefined,
        });
    }

    triggerEdit(event, id) {
        this.setState({
            open: true,
            editing: true,
            initialData: this.state.upcoming.find(s => s.id === id),
        });
    }

    deleteAll(table) {
        const toDelete = table === 'upcoming' ? this.state.upcomingSelected : this.state.pastSelected;

        Promise.all(
            toDelete.map(s => {
                return requests.deleteWithAuth(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules/${s}`,
                    this.props.auth
                );
            })
        )
            .then(() => {
                this.setSchedules(
                    [...this.state.past, ...this.state.upcoming].filter(s => !toDelete.some(td => s.id === td))
                );
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg: 'Error: could not delete schedule(s)! Check the console for more information.',
                    errorOpen: true,
                    loading: false,
                });
            });
    }

    handleSave(savedData) {
        this.setState({ updating: true });

        if (this.state.editing) {
            let schedule = {
                id: savedData.id,
                timeFrom: savedData.timeFrom,
                timeTo: savedData.timeTo,
            };

            if (new Date(schedule.timeFrom) > new Date(schedule.timeTo)) {
                this.setState({
                    errorOpen: true,
                    errorMsg: 'Schedule end date is before start date',
                    updating: false,
                });
                return;
            }

            if (savedData.placeId) {
                schedule.placeId = savedData.placeId;
                schedule.location = savedData.location;
            }

            let i;
            for (i = 0; i < this.state.upcoming.length; i++) {
                /** End time overlap */
                if (
                    this.state.upcoming[i].id !== schedule.id &&
                    new Date(schedule.timeTo) > new Date(this.state.upcoming[i].timeFrom) &&
                    new Date(schedule.timeFrom) < new Date(this.state.upcoming[i].timeFrom)
                ) {
                    this.setState({
                        errorOpen: true,
                        errorMsg:
                            'Schedule end date exceeds start date of another schedule beginning at ' +
                            format(new Date(this.state.upcoming[i].timeFrom), "hh:mm a 'on' MM-dd-yyyy"),
                        updating: false,
                    });
                    return;
                } else if (
                    /** Start time overlap */
                    this.state.upcoming[i].id !== schedule.id &&
                    new Date(this.state.upcoming[i].timeTo) > new Date(schedule.timeFrom) &&
                    new Date(this.state.upcoming[i].timeTo) < new Date(schedule.timeTo)
                ) {
                    this.setState({
                        errorOpen: true,
                        errorMsg:
                            'Schedule start date is before the end of another schedule ending at ' +
                            format(new Date(this.state.upcoming[i].timeTo), "MM-dd-yyyy 'at' hh:mm a"),
                        updating: false,
                    });
                    return;
                } else if (
                    /** Schedule within another schedule */
                    this.state.upcoming[i].id !== schedule.id &&
                    new Date(this.state.upcoming[i].timeFrom) < new Date(schedule.timeFrom) &&
                    new Date(this.state.upcoming[i].timeTo) > new Date(schedule.timeTo)
                ) {
                    this.setState({
                        errorOpen: true,
                        errorMsg:
                            'Schedule start date is after the start of another schedule starting at ' +
                            format(new Date(this.state.upcoming[i].timeFrom), "MM-dd-yyyy 'at' hh:mm a") +
                            ' AND ' +
                            'Schedule end date is before the end of another schedule ending at ' +
                            format(new Date(this.state.upcoming[i].timeTo), "MM-dd-yyyy 'at' hh:mm a"),
                        updating: false,
                    });
                    return;
                }
            }

            requests
                .patchWithAuth(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules/${savedData.id}`,
                    schedule,
                    this.props.auth
                )
                .then(() => {
                    this.setState({
                        open: false,
                        updating: false,
                    });
                    this.fetchData();
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        errorMsg: 'Error: could not save schedule data! Check the console for more information.',
                        errorOpen: true,
                        loading: false,
                        updating: false,
                    });
                });
        } else {
            let schedule = {
                timeFrom: savedData.timeFrom,
                timeTo: savedData.timeTo,
                placeId: savedData.placeId,
                location: savedData.location,
            };

            if (new Date(schedule.timeFrom) > new Date(schedule.timeTo)) {
                this.setState({
                    errorOpen: true,
                    errorMsg: 'Schedule end date is before start date',
                    updating: false,
                });
                return;
            }

            let i;
            for (i = 0; i < this.state.upcoming.length; i++) {
                /** End time overlap */
                if (
                    this.state.upcoming[i].id !== schedule.id &&
                    new Date(schedule.timeTo) > new Date(this.state.upcoming[i].timeFrom) &&
                    new Date(schedule.timeFrom) < new Date(this.state.upcoming[i].timeFrom)
                ) {
                    this.setState({
                        errorOpen: true,
                        errorMsg:
                            'Schedule end date exceeds start date of another schedule beginning at ' +
                            format(new Date(this.state.upcoming[i].timeFrom), "hh:mm a 'on' MM-dd-yyyy"),
                        updating: false,
                    });
                    return;
                } else if (
                    /** Start time overlap */
                    this.state.upcoming[i].id !== schedule.id &&
                    new Date(this.state.upcoming[i].timeTo) > new Date(schedule.timeFrom) &&
                    new Date(this.state.upcoming[i].timeTo) < new Date(schedule.timeTo)
                ) {
                    this.setState({
                        errorOpen: true,
                        errorMsg:
                            'Schedule start date is before the end of another schedule ending at ' +
                            format(new Date(this.state.upcoming[i].timeTo), "MM-dd-yyyy 'at' hh:mm a"),
                        updating: false,
                    });
                    return;
                } else if (
                    /** Schedule within another schedule */
                    this.state.upcoming[i].id !== schedule.id &&
                    new Date(this.state.upcoming[i].timeFrom) < new Date(schedule.timeFrom) &&
                    new Date(this.state.upcoming[i].timeTo) > new Date(schedule.timeTo)
                ) {
                    this.setState({
                        errorOpen: true,
                        errorMsg:
                            'Schedule start date is after the start of another schedule starting at ' +
                            format(new Date(this.state.upcoming[i].timeFrom), "MM-dd-yyyy 'at' hh:mm a") +
                            ' AND ' +
                            'Schedule end date is before the end of another schedule ending at ' +
                            format(new Date(this.state.upcoming[i].timeTo), "MM-dd-yyyy 'at' hh:mm a"),
                        updating: false,
                    });
                    return;
                }
            }

            requests
                .postWithAuth(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/schedules`,
                    schedule,
                    this.props.auth
                )
                .then(() => {
                    this.setState({
                        open: false,
                        updating: false,
                    });
                    this.fetchData();
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        errorMsg: 'Error: could not create schedule! Check the console for more information.',
                        errorOpen: true,
                        loading: false,
                        updating: false,
                    });
                });
        }
    }

    render() {
        const { classes } = this.props;

        const columns = [
            { id: 'location', align: 'left', width: '175px', disablePadding: false, label: 'Location' },
            {
                id: 'timeFrom',
                align: 'left',
                width: '225px',
                disablePadding: false,
                label: 'Start Time',
                renderer: val => format(val, 'Pp'),
            },
            {
                id: 'timeTo',
                align: 'left',
                width: '225px',
                disablePadding: false,
                label: 'End Time',
                renderer: val => format(val, 'Pp'),
            },
        ];

        const rowActions = [
            { references: 'id', color: 'primary', label: 'Edit', action: this.triggerEdit },
            { references: 'id', color: 'secondary', label: 'Delete', action: this.deleteScheduleById },
        ];

        const selectedActionsUpcoming = [
            { title: 'Delete All', icon: <Delete />, action: () => this.deleteAll('upcoming') },
        ];

        const selectedActionsPast = [{ title: 'Delete All', icon: <Delete />, action: () => this.deleteAll('past') }];

        const unselectedActions = [{ title: 'Add', icon: <Add />, action: this.triggerCreation }];

        return (
            <div>
                {this.props.router?.query?.truck_id && (
                    <Head>
                        <title>Schedule</title>
                    </Head>
                )}
                <Container className={classes.root}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link href="/owner/trucks" passHref>
                            <MuiLink color="inherit">My Trucks</MuiLink>
                        </Link>
                        {this.props.router?.query?.truck_id ? (
                            <Link href={`/owner/trucks/${this.props.router.query.truck_id}`} passHref>
                                <MuiLink color="inherit">Manage Truck</MuiLink>
                            </Link>
                        ) : (
                            <Typography color="textPrimary">Truck</Typography>
                        )}
                        <Typography color="textPrimary">Schedule</Typography>
                    </Breadcrumbs>
                    <Grid container spacing={0}>
                        <Grid item xs={12} md={6}>
                            <Box style={{ textAlign: 'left', overflow: 'auto', position: 'relative' }}>
                                <EnhancedTable
                                    columns={columns}
                                    rowActions={rowActions}
                                    selectedActions={selectedActionsUpcoming}
                                    unselectedActions={unselectedActions}
                                    title="Upcoming Schedules"
                                    rows={this.state.upcoming}
                                    order="asc"
                                    orderBy="timeFrom"
                                    onSelectionChange={data => {
                                        this.setState({ upcomingSelected: data });
                                    }}
                                />
                                {this.state.loading && <CircularProgress className={classes.progress} size={64} />}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box style={{ textAlign: 'left', overflow: 'auto', position: 'relative' }}>
                                <EnhancedTable
                                    columns={columns}
                                    rowActions={rowActions.slice(1)}
                                    selectedActions={selectedActionsPast}
                                    title="Past Schedules"
                                    rows={this.state.past}
                                    order="desc"
                                    orderBy="timeFrom"
                                    onSelectionChange={data => this.setState({ pastSelected: data })}
                                />
                                {this.state.loading && <CircularProgress className={classes.progress} size={64} />}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <DraggableDialog
                    open={this.state.open}
                    updating={this.state.updating}
                    editing={this.state.editing}
                    initialData={this.state.initialData}
                    onClose={() => this.setState({ open: false })}
                    onSave={this.handleSave}
                />{' '}
                <Snackbar
                    open={this.state.errorOpen}
                    autoHideDuration={5000}
                    onClose={(_event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }

                        this.setState({
                            errorOpen: false,
                        });
                    }}
                    onExited={() => this.setState({ errorSeverity: 'error' })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        variant="filled"
                        severity={this.state.errorSeverity}
                        onClose={() => {
                            this.setState({
                                errorOpen: false,
                            });
                        }}
                    >
                        {this.state.errorMsg}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

ScheduleManagementPage.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.object,
    classes: PropTypes.object,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default withStyles(scheduleStyles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleManagementPage))
);
