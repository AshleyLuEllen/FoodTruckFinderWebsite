import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import { Card, CardHeader, CardMedia, CardContent, IconButton, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import {format} from "date-fns";
import TextField from "@material-ui/core/TextField";
import {
    Scheduler,
    DayView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';

import {ViewState} from "@devexpress/dx-react-scheduler";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
    root: {
        '&:hover': {
            cursor: "pointer"
        }
    },
}));


function ScheduleCard(props) {
    const classes = useStyles();

    const [selected, setSelected] = useState(new Date(props.schedules[0].timeFrom));
    const [scheduledDays, setScheduledDays] = [props.schedules];

    console.log(props.schedules);
    const [schedules] = [props.schedules.forEach(s => {return {startDate: s.timeFrom, endDate: s.timeTo, title: s.location}})];

    const handleClick = (event) => {
        setSelected(event.target.value)
    };

    return (
        <Card className={props.className}>
            <CardContent>
                <Grid>
                    <Grid xs={3}>
                        <Paper>
                        <Scheduler
                            data={schedules}

                        >
                            <ViewState
                                currentDate={selected}
                            />
                            <WeekView
                                startDayHour={6}
                                endDayHour={20}
                            />
                            {/*<DayView*/}
                            {/*    intervalCount={1}*/}
                            {/*    startDayHour={6}*/}
                            {/*    endDayHour={20}*/}
                            {/*/>*/}
                            <Appointments />
                        </Scheduler>
                        </Paper>
                    </Grid>
                    <br/>
                    <Grid xs={3}>
                        <div>
                            {props.schedules.map(s => {
                                if (selected !== undefined) {
                                    if (selected.getMonth() === new Date(s.timeFrom).getMonth()) {
                                        if (selected.getDay() === new Date(s.timeFrom).getDay()) {
                                            return <span> {s.location}: { format(new Date(s.timeFrom), "HH:mm") } to { format(new Date(s.timeTo), "HH:mm") } </span>
                                        }
                                    } else if (selected.getMonth() === new Date(s.timeTo).getMonth()) {
                                        if (selected.getDay() === new Date(s.timeTo).getDay()) {
                                            return <span> {s.location}: { format(new Date(s.timeFrom), "HH:mm") } to { format(new Date(s.timeTo), "HH:mm") } </span>
                                        }
                                    }
                                }
                            })}
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

    );
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleCard);
