import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import { Card, CardHeader, CardMedia, CardContent, IconButton, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Grid from "@material-ui/core/Grid";
import {format} from "date-fns";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    root: {
        '&:hover': {
            cursor: "pointer"
        }
    },
}));


function ScheduleCard(props) {
    const classes = useStyles();

    const [selected, setSelected] = useState(props.schedules[0].timeTo);
    const [scheduledDays, setScheduledDays] = [props.schedules.map(s => s.timeFrom.getDay),props.schedules.map(s => s.timeTo.getDay)]

    const handleClick = (event) => {
        setSelected(event.target.value)
    };

    return (
        <Card className={props.className}>
            <CardContent>
                <Grid>
                    <Grid xs={6}>
                        <CardHeader
                            title={"Calendar"}
                        />
                        <form noValidate>
                        <TextField
                            id="datetime-local"
                            label="Select Date"
                            type={"datetime-local"}
                            defaultValue={new Date()}
                            value={selected}
                            onChange={handleClick}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        </form>
                    </Grid>
                    <Grid xs={6}>
                        {selected > 10000 &&
                        <div>
                            {props.schedules.map(s => {
                                if(s.timeFrom.getDay() === selected.getDay() || s.timeTo.getDay() === selected.getDay()) {
                                    return <span> {s.location}: {format(new Date(s.timeFrom), "HH:mm")} to {format(new Date(s.timeTo), "HH:mm")} </span>
                                }
                            })}
                        </div>
                        }
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
