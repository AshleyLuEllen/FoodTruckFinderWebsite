import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { stableSort, getComparator } from '../../util/tables';

import {
    Table,
    TableContainer,
    TableCell,
    TableBody,
    TableRow,
    TablePagination,
    Paper,
    Checkbox,
    Button,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';

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

class EnhancedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'desc',
            orderBy: 'date',
            selected: [],
            page: -0,
            dense: true,
            rowsPerPage: 10,
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.handleRequestSort = this.handleRequestSort.bind(this);
    }

    componentDidMount() {
        this.setInitialSort();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.order !== this.props.order || prevProps.orderBy !== this.props.orderBy) {
            this.setInitialSort();
        }

        if (prevProps.rows.length > this.props.rows.length) {
            this.setState({
                selected: [],
            });
        }
    }

    setInitialSort() {
        this.setState({
            order: this.props.order,
            orderBy: this.props.orderBy,
        });
    }

    handleRequestSort(_event, property) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property,
        });
    }

    handleSelectAllClick(event) {
        if (event.target.checked) {
            const newSelecteds = this.props.rows.map(n => n.id);
            this.setState({
                selected: newSelecteds,
            });

            if (this.props.onSelectionChange) {
                this.props.onSelectionChange(newSelecteds);
            }
        } else {
            this.setState({
                selected: [],
            });

            if (this.props.onSelectionChange) {
                this.props.onSelectionChange([]);
            }
        }
    }

    handleClick(event, id) {
        this.props.handleRowClick && this.props.handleRowClick(event, id);
    }

    // eslint-disable-next-line no-unused-vars
    handleSelectClick(event, id) {
        event.stopPropagation();
    }

    handleSelectionChange(event, id) {
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

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newSelected);
        }
    }

    handleChangePage(event, newPage) {
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
        return this.state.selected.indexOf(id) !== -1;
    }

    render() {
        const emptyRows =
            this.state.rowsPerPage -
            Math.min(this.state.rowsPerPage, this.props.rows.length - this.state.page * this.state.rowsPerPage);
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar
                        numSelected={this.state.selected.length}
                        title={this.props.title}
                        selectedActions={this.props.selectedActions}
                        unselectedActions={this.props.unselectedActions}
                    />
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby={this.props.title}
                            size={this.state.dense ? 'small' : 'medium'}
                            aria-label={this.props.title}
                        >
                            <colgroup>
                                <col style={{ width: '50px' }} />
                                {this.props.columns.map((column, i) => (
                                    <col key={i} style={{ width: column.width }} />
                                ))}
                            </colgroup>
                            <EnhancedTableHead
                                classes={classes}
                                numSelected={this.state.selected.length}
                                order={this.state.order}
                                orderBy={this.state.orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={this.props.rows.length}
                                columns={this.props.columns}
                                rowActions={this.props.rowActions}
                            />
                            <TableBody>
                                {stableSort(this.props.rows, getComparator(this.state.order, this.state.orderBy))
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
                                                onClick={event => this.handleClick(event, row.id)}
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
                                                {this.props.columns.map((column, i) => (
                                                    <TableCell key={i} align={column.align}>
                                                        {column.renderer
                                                            ? column.renderer(row[column.id])
                                                            : row[column.id]}
                                                    </TableCell>
                                                ))}
                                                {this.props.rowActions && (
                                                    <TableCell>
                                                        <div style={{ display: 'flex' }}>
                                                            {this.props.rowActions.map((action, i) => (
                                                                <Button
                                                                    key={i}
                                                                    variant="contained"
                                                                    size="small"
                                                                    color={action.color}
                                                                    style={{
                                                                        width: 'auto',
                                                                        height: 'auto',
                                                                        margin: '0px',
                                                                        marginRight: '5px',
                                                                    }}
                                                                    onClick={e =>
                                                                        action.action &&
                                                                        action.action(e, row[action.references])
                                                                    }
                                                                >
                                                                    {action.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (this.state.dense ? 43 : 63) * emptyRows }}>
                                        <TableCell colSpan={this.props.columns.length + 2} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={this.props.rows.length}
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

EnhancedTable.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rows: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    selectedActions: PropTypes.array,
    unselectedActions: PropTypes.array,
    rowActions: PropTypes.array,
    onSelectionChange: PropTypes.func,
    handleRowClick: PropTypes.func,
    classes: PropTypes.any,
};

export default withStyles(notificationStyles, { withTheme: true })(EnhancedTable);
