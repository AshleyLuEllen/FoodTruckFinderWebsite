import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardMedia, CardContent, IconButton, Chip, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import Paper from '@material-ui/core/Paper';
import { DataGrid, ColDef } from '@material-ui/data-grid';

const useStyles = makeStyles(theme => ({
    root: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
}));

function ScheduleCard(props) {
    const classes = useStyles();

    console.log(props.schedules);
    const columns = [
        {
            field: 'id',
            hide: true,
        },
        {
            field: 'location',
            headerName: 'Location',
            // type: 'string',
            flex: 1,
            // width: '200px',
            // sortable: false,
        },
        {
            field: 'timeFrom',
            headerName: 'Start Time',
            // type: 'string',
            // type: 'dateTime',
            // flex: 1,
            width: '300px',
            // sortable: false,
        },
        {
            field: 'timeTo',
            headerName: 'End Time',
            // type: 'string',
            // type: 'dateTime',
            flex: 1,
            // width: '300px',
            // sortable: false,
        },
    ];
    const tempRows = props.schedules.sort((a, b) => (a.timeFrom > b.timeFrom ? 1 : -1));
    const rows = tempRows
        .filter(s => new Date(s.timeFrom) >= Date.now())
        .map(s => ({
            id: s.id,
            location: s.location,
            timeFrom: format(new Date(s.timeFrom), "EEE MMM do, yyyy' at 'hh:mm a"),
            timeTo: format(new Date(s.timeTo), "EEE MMM do, yyyy' at 'hh:mm a"),
        }));

    console.log(rows);
    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    );
}

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleCard);
