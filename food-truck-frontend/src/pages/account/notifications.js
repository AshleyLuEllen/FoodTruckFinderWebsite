/* eslint-disable indent */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import { logout as authLogout } from '../../redux/actions/auth';
import { connect } from 'react-redux';
import { CheckBox, CheckBoxOutlined, Flag, FlagOutlined } from '@material-ui/icons';
import Head from "next/dist/next-server/lib/head";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

const headCells = [
    { id: 'unread', align: 'left', disablePadding: true, label: 'Unread' },
    { id: 'saved', align: 'left', disablePadding: true, label: 'Saved' },
    { id: 'truck_name', align: 'left', disablePadding: false, label: 'Food Truck' },
    { id: 'subject', align: 'left', disablePadding: false, label: 'Subject' },
    { id: 'date', align: 'right', disablePadding: false, label: 'Date' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <Head>
                <title>Notifications</title>
            </Head>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85),
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark,
              },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    const markAllAsFlagged = () => {
        props.markAllAsFlagged ? props.markAllAsFlagged() : undefined;
    };

    const markAllAsUnflagged = () => {
        props.markAllAsUnflagged ? props.markAllAsUnflagged() : undefined;
    };

    const markAllAsRead = () => {
        props.markAllAsRead ? props.markAllAsRead() : undefined;
    };

    const markAllAsUnread = () => {
        props.markAllAsUnread ? props.markAllAsUnread() : undefined;
    };

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h4" id="tableTitle" component="div">
                    Notifications
                </Typography>
            )}

            {numSelected > 0 ? (
                <Fragment>
                    <Tooltip title="Read">
                        <IconButton aria-label="read" onClick={markAllAsRead}>
                            <CheckBoxOutlined />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Unread">
                        <IconButton aria-label="unread" onClick={markAllAsUnread}>
                            <CheckBox />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Flag">
                        <IconButton aria-label="flag" onClick={markAllAsFlagged}>
                            <Flag />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Unflag">
                        <IconButton aria-label="unflag" onClick={markAllAsUnflagged}>
                            <FlagOutlined />
                        </IconButton>
                    </Tooltip>
                </Fragment>
            ) : (
                // <Tooltip title="Filter list">
                //   <IconButton aria-label="filter list">
                //     <FilterListIcon />
                //   </IconButton>
                // </Tooltip>
                <div></div>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    markAllAsFlagged: PropTypes.func,
    markAllAsRead: PropTypes.func,
    markAllAsUnflagged: PropTypes.func,
    markAllAsUnread: PropTypes.func,
};

const notificationStyles = theme => ({
    root: {
        width: '100%',
        padding: '20px',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
});

function createData(unread, saved, truck_name, subject, date, id, description) {
    return { unread, saved, truck_name, subject, date, id, description };
}

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            order: 'desc',
            orderBy: 'date',
            selected: [],
            page: -0,
            dense: false,
            rowsPerPage: 10,
            userId: undefined,
        };

        this.markAllAsFlagged = this.markAllAsFlagged.bind(this);
        this.markAllAsUnflagged = this.markAllAsUnflagged.bind(this);
        this.markAllAsUnread = this.markAllAsUnread.bind(this);
        this.markAllAsRead = this.markAllAsRead.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    markAllAsRead() {
        Promise.all(
            this.state.selected
                .map(id => this.state.rows.find(row => row.id === id))
                .map(not => {
                    axios.patch(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/notifications/${not.id}`,
                        {
                            unread: false,
                        },
                        {
                            auth: {
                                username: this.props.auth.email,
                                password: this.props.auth.password,
                            },
                        }
                    );
                })
        )
            .then(this.fetchData)
            .catch(err => console.log(err));
    }

    markAllAsUnread() {
        Promise.all(
            this.state.selected
                .map(id => this.state.rows.find(row => row.id === id))
                .map(not => {
                    axios.patch(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/notifications/${not.id}`,
                        {
                            unread: true,
                        },
                        {
                            auth: {
                                username: this.props.auth.email,
                                password: this.props.auth.password,
                            },
                        }
                    );
                })
        )
            .then(this.fetchData)
            .catch(err => console.log(err));
    }

    markAllAsFlagged() {
        Promise.all(
            this.state.selected
                .map(id => this.state.rows.find(row => row.id === id))
                .map(not => {
                    return axios.patch(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/notifications/${not.id}`,
                        {
                            saved: true,
                        },
                        {
                            auth: {
                                username: this.props.auth.email,
                                password: this.props.auth.password,
                            },
                        }
                    );
                })
        )
            .then(this.fetchData)
            .catch(err => console.log(err));
    }

    markAllAsUnflagged() {
        Promise.all(
            this.state.selected
                .map(id => this.state.rows.find(row => row.id === id))
                .map(not => {
                    axios.patch(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/notifications/${not.id}`,
                        {
                            saved: false,
                        },
                        {
                            auth: {
                                username: this.props.auth.email,
                                password: this.props.auth.password,
                            },
                        }
                    );
                })
        )
            .then(this.fetchData)
            .catch(err => console.log(err));
    }

    fetchData() {
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
                auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password,
                },
            })
            .then(res => {
                this.setState({
                    userId: res.data.id,
                });
                return axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${res.data.id}/notifications`, {
                    auth: {
                        username: this.props.auth.email,
                        password: this.props.auth.password,
                    },
                });
            })
            .then(res => {
                this.setState({
                    rows: res.data.map(not =>
                        createData(
                            not.unread,
                            not.saved,
                            not.truck.name,
                            not.subject,
                            not.postedTimestamp,
                            not.id,
                            not.description
                        )
                    ),
                });
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchData();
    }

    handleRequestSort(property) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property,
        });
    }

    handleSelectAllClick(event) {
        if (event.target.checked) {
            const newSelecteds = this.state.rows.map(n => n.id);
            this.setState({
                selected: newSelecteds,
            });
            return;
        }
        this.setState({
            selected: [],
        });
    }

    handleClick(id) {
        alert(this.state.rows.find(row => row.id === id)?.description);
        axios
            .patch(
                `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/notifications/${id}`,
                {
                    unread: false,
                },
                {
                    auth: {
                        username: this.props.auth.email,
                        password: this.props.auth.password,
                    },
                }
            )
            .then(() => {
                const i = this.state.rows.findIndex(row => row.id === id);
                this.setState({
                    rows: [
                        ...this.state.rows.slice(0, i),
                        {
                            ...this.state.rows[i],
                            unread: false,
                        },
                        ...this.state.rows.slice(i + 1),
                    ],
                });
            })
            .catch(err => console.log(err));
    }

    handleSelectClick(event) {
        event.stopPropagation();
    }

    handleSelectionChange(id) {
        const selectedIndex = this.state.selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.state.selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.state.selected.slice(1));
        } else if (selectedIndex === this.state.selected.length - 1) {
            newSelected = newSelected.concat(this.state.selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.state.selected.slice(0, selectedIndex),
                this.state.selected.slice(selectedIndex + 1)
            );
        }

        this.setState({
            selected: newSelected,
        });
    }

    handleChangePage(newPage) {
        this.setState({
            page: newPage,
        });
    }

    handleChangeRowsPerPage(event) {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0,
        });
    }

    handleChangeDense(event) {
        this.setState({
            dense: event.target.checked,
        });
    }

    isSelected(id) {
        this.state.selected.indexOf(id) !== -1;
    }

    render() {
        const emptyRows =
            this.state.rowsPerPage -
            Math.min(this.state.rowsPerPage, this.state.rows.length - this.state.page * this.state.rowsPerPage);
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar
                        numSelected={this.state.selected.length}
                        markAllAsFlagged={this.markAllAsFlagged}
                        markAllAsRead={this.markAllAsRead}
                        markAllAsUnflagged={this.markAllAsUnflagged}
                        markAllAsUnread={this.markAllAsUnread}
                    />
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={this.state.dense ? 'small' : 'medium'}
                            aria-label="enhanced table"
                        >
                            <colgroup>
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '50%' }} />
                                <col style={{ width: '20%' }} />
                            </colgroup>
                            <EnhancedTableHead
                                classes={classes}
                                numSelected={this.state.selected.length}
                                order={this.state.order}
                                orderBy={this.state.orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={this.state.rows.length}
                            />
                            <TableBody>
                                {stableSort(this.state.rows, getComparator(this.state.order, this.state.orderBy))
                                    .slice(
                                        this.state.page * this.state.rowsPerPage,
                                        this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
                                    )
                                    .map((row, index) => {
                                        const isItemSelected = this.isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={() => this.handleClick(row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                        onChange={() => this.handleSelectionChange(row.id)}
                                                        onClick={event => this.handleSelectClick(event)}
                                                    />
                                                </TableCell>
                                                <TableCell padding="none">
                                                    {row.unread ? <CheckBox /> : <CheckBoxOutlined />}
                                                </TableCell>
                                                <TableCell padding="none">
                                                    {row.saved ? <Flag /> : <FlagOutlined />}
                                                </TableCell>
                                                <TableCell>{row.truck_name}</TableCell>
                                                <TableCell>{row.subject}</TableCell>
                                                <TableCell align="right">{row.date}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (this.state.dense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.state.rows.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        );
    }
}

Notifications.propTypes = {
    auth: PropTypes.any,
    classes: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogout,
};

export default withStyles(notificationStyles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(Notifications)
);
