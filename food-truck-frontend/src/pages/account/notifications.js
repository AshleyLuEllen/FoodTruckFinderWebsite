import React, { Component } from 'react';
import Link from "next/link";
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

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
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', align: 'left', disablePadding: true, label: 'Read' },
  { id: 'saved', align: 'left', disablePadding: true, label: 'Saved' },
  { id: 'truck_name', align: 'left', disablePadding: false, label: 'Food Truck' },
  { id: 'subject', align: 'left', disablePadding: false, label: 'Subject' },
  { id: 'date', align: 'right', disablePadding: false, label: 'Date' },
];


function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
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

const useToolbarStyles = makeStyles((theme) => ({
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

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

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
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const notificationStyles = (theme) => ({
  root: {
    width: '100%',
    padding: "20px"
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750
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

function createData(name, saved, truck_name, subject, date, id, description) {
    return { name, saved, truck_name, subject, date, id, description };
}

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 1, "Test description"),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 2),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-05 22:42:31.755141', 3),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 4),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 5),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 6),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 7),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 8),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 9),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 10),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 11),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 12),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 13),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 14),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 15),
                createData(true, true, 'Truck 1', 'This is a subject line', '2020-11-04 22:42:31.755141', 16),
            ],
            order: 'desc',
            orderBy: 'date',
            selected: [],
            page: -0,
            dense: false,
            rowsPerPage: 10
        }
    }

    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        });
    };
    
    handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = this.state.rows.map((n) => n.id);
          this.setState({
              selected: newSelecteds
          });
          return;
        }
        this.setState({
            selected: []
        });
    };

    handleClick = (event, id) => {
        alert(this.state.rows.find(row => row.id === id)?.description);
    }

    handleSelectClick = (event, id) => {
        event.stopPropagation();
    }
    
    handleSelectionChange = (event, id) => {
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
                this.state.selected.slice(selectedIndex + 1),
            );
        }
    
        this.setState({
            selected: newSelected
        });
    };
    
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        });
    };
    
    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };
    
    handleChangeDense = (event) => {
        this.setState({
            dense: event.target.checked
        });
    };
    
    isSelected = (id) => this.state.selected.indexOf(id) !== -1;
      
    render() {
        const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.rows.length - this.state.page * this.state.rowsPerPage);
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar numSelected={this.state.selected.length} />
                    <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={this.state.dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <colgroup>
                            <col style={{width:'5%'}}/>
                            <col style={{width:'5%'}}/>
                            <col style={{width:'5%'}}/>
                            <col style={{width:'15%'}}/>
                            <col style={{width:'50%'}}/>
                            <col style={{width:'20%'}}/>
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
                            .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                            .map((row, index) => {
                            const isItemSelected = this.isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                hover
                                onClick={(event) => this.handleClick(event, row.id)}
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
                                    onChange={event => this.handleSelectionChange(event, row.id)}
                                    onClick={event => this.handleSelectClick(event, row.id)}
                                    />
                                </TableCell>
                                <TableCell padding="none">
                                    {row.read}
                                </TableCell>
                                <TableCell padding="none">{row.saved}</TableCell>
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
export default withStyles(notificationStyles, { withTheme: true})(Notifications);
