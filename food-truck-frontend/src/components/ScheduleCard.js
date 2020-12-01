/* eslint-disable quotes */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { format } from 'date-fns';
import { DataGrid } from '@material-ui/data-grid';
function ScheduleCard(props) {
    const columns = [
        { field: 'location', headerName: 'Location', width: 200, sortable: false },
        { field: 'timeFrom', headerName: 'Start Time', type: 'dateTime', width: 350, sortable: false },
        { field: 'timeTo', headerName: 'End Time', type: 'dateTime', width: 350, sortable: false },
    ];
    const tempRows = props.schedules.sort((a, b) => (a.timeFrom > b.timeFrom ? 1 : -1));
    const rows = tempRows
        .filter(s => new Date(s.timeTo) >= Date.now())
        .map(s => ({
            id: s.id,
            location: s.location,
            timeFrom: format(new Date(s.timeFrom), "EEE MMM do, yyyy' at 'hh:mm a"),
            timeTo: format(new Date(s.timeTo), "EEE MMM do, yyyy' at 'hh:mm a"),
        }));

    return (
        <div style={{ height: 400, width: props.width ? props.width : '100%', flexGrow: 1 }}>
            <DataGrid rows={rows} columns={columns} pageSize={7} />
        </div>
    );
}

ScheduleCard.propTypes = {
    className: PropTypes.any,
    schedules: PropTypes.array,
    width: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleCard);
